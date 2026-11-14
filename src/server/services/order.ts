import "server-only";
import { randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { getCart } from "./cart";
import { sendOrderConfirmation } from "./notifications";
import { createRazorpayOrder, isMockPayments, publicKeyId } from "@/server/integrations/razorpay";
import { formatPaise, includedGst } from "@/lib/money";
import { COD_FEE, MIN_ORDER } from "@/config/shipping";
import { deliveryWindow } from "@/lib/delivery";
import type { AddressInput, CheckoutInput } from "@/lib/validation/checkout";

function newOrderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `TS${ymd}${randomInt(1000, 9999)}`;
}

async function saveAddress(userId: string, a: AddressInput) {
  const data = { name: a.name, phone: a.phone, pincode: a.pincode, city: a.city, state: a.state, line1: a.line1, line2: a.line2 || null, landmark: a.landmark || null };
  const same = await db.address.findFirst({ where: { userId, pincode: a.pincode, line1: a.line1 } });
  await db.$transaction([
    db.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    same
      ? db.address.update({ where: { id: same.id }, data: { ...data, isDefault: true } })
      : db.address.create({ data: { ...data, userId, isDefault: true } }),
  ]);
}

export interface PlaceOrderResult {
  orderNumber: string;
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  mock: boolean;
}

/**
 * Creates the order and its Razorpay order.
 * Online: the whole total is paid now. Cash on delivery: only the COD charge is paid now (to confirm
 * the order); the order total includes that charge and the rest is collected in cash.
 */
export async function placeOrder(user: { id: string; email: string; name: string | null }, input: CheckoutInput): Promise<PlaceOrderResult> {
  const cart = await getCart();
  if (cart.lines.length === 0) throw new AppError("cart_empty", "Your cart is empty.", 400);
  if (cart.totals.belowMinimumBy > 0) {
    throw new AppError("below_minimum", `The minimum order is ${formatPaise(MIN_ORDER)}. Add ${formatPaise(cart.totals.belowMinimumBy)} more to check out.`, 400);
  }

  const products = await db.product.findMany({
    where: { id: { in: cart.lines.map((l) => l.productId) } },
    select: { id: true, stockQty: true, gstRate: true, name: true, status: true },
  });
  for (const line of cart.lines) {
    const p = products.find((x) => x.id === line.productId);
    if (!p || p.status !== "active") throw new AppError("unavailable", `${line.name} is no longer available. Please remove it from your cart.`, 409);
    if (p.stockQty < line.qty) throw new AppError("insufficient_stock", `Only ${p.stockQty} left of ${p.name}. Please update your cart.`, 409);
  }

  const { totals } = cart;
  const scale = totals.subtotal ? (totals.subtotal - totals.discount) / totals.subtotal : 0;
  const address = { ...input.address, line2: input.address.line2 || null, landmark: input.address.landmark || null };
  const orderNumber = newOrderNumber();
  const isCod = input.paymentMethod === "cod";
  const codFee = isCod ? COD_FEE : 0;
  const payNow = isCod ? COD_FEE : totals.total;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: user.id,
      email: user.email,
      phone: input.phone,
      address: address as Prisma.InputJsonValue,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      codFee,
      gst: totals.gstIncluded,
      total: totals.total + codFee,
      paymentMethod: isCod ? "cod" : "razorpay",
      status: "pending_payment",
      couponCode: totals.discount > 0 ? cart.couponCode : null,
      items: {
        create: cart.lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          image: l.image,
          qty: l.qty,
          unitPrice: l.unitPrice,
          gst: includedGst(Math.round(l.lineTotal * scale), products.find((p) => p.id === l.productId)!.gstRate),
        })),
      },
    },
    include: { items: true },
  });

  if (input.saveAddress) await saveAddress(user.id, input.address);
  if (!user.name) await db.user.update({ where: { id: user.id }, data: { name: input.address.name, phone: input.phone } });

  const rp = await createRazorpayOrder(payNow, orderNumber, { order_number: orderNumber, ...(isCod ? { purpose: "cod_charge" } : {}) });
  await db.payment.create({ data: { orderId: order.id, razorpayOrderId: rp.id, amount: payNow } });
  return { orderNumber, keyId: publicKeyId(), razorpayOrderId: rp.id, amount: payNow, mock: isMockPayments() };
}

/**
 * Marks a payment captured and the order placed. Idempotent: the browser callback and the webhook
 * may both arrive, and only the first one changes anything.
 */
export async function markPaymentCaptured(razorpayOrderId: string, details: { paymentId: string; signature?: string; method?: string; raw?: unknown }) {
  const payment = await db.payment.findUnique({ where: { razorpayOrderId }, include: { order: { include: { items: true } } } });
  if (!payment) throw new AppError("payment_unknown", "Payment not found.", 404);
  if (payment.status === "paid") return payment.order;

  const order = payment.order;
  await db.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: { not: "paid" } },
      data: {
        status: "paid",
        razorpayPaymentId: details.paymentId,
        razorpaySignature: details.signature,
        method: details.method,
        ...(details.raw ? { rawWebhook: details.raw as Prisma.InputJsonValue } : {}),
      },
    });
    if (claimed.count === 0) return;
    // COD: only the COD charge was paid, so the order stays "unpaid" until the cash is collected on delivery.
    const paymentStatus = order.paymentMethod === "cod" ? "unpaid" : "paid";
    await tx.order.update({ where: { id: order.id }, data: { status: "placed", paymentStatus, placedAt: new Date() } });
    for (const item of order.items) {
      if (item.productId) await tx.product.update({ where: { id: item.productId }, data: { stockQty: { decrement: item.qty } } });
    }
    if (order.couponCode) await tx.coupon.updateMany({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } });
    await tx.cartItem.deleteMany({ where: { cart: { userId: order.userId }, productId: { in: order.items.map((i) => i.productId).filter((id): id is string => !!id) } } });
    await tx.cart.updateMany({ where: { userId: order.userId }, data: { couponCode: null } });
  });

  await sendOrderConfirmation({
    orderNumber: order.orderNumber,
    email: order.email,
    total: order.total,
    shipping: order.shipping,
    codFee: order.codFee,
    items: order.items,
    address: order.address as unknown as OrderAddress,
  });
  return order;
}

export async function markPaymentFailed(razorpayOrderId: string, raw?: unknown) {
  const payment = await db.payment.findUnique({ where: { razorpayOrderId } });
  if (!payment || payment.status === "paid") return;
  await db.$transaction([
    db.payment.update({ where: { id: payment.id }, data: { status: "failed", ...(raw ? { rawWebhook: raw as Prisma.InputJsonValue } : {}) } }),
    db.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "failed" } }),
  ]);
}

export interface OrderAddress {
  name: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
}

export async function getOrderForUser(orderNumber: string, userId: string) {
  return db.order.findFirst({ where: { orderNumber, userId }, include: { items: true, shipment: true } });
}

/**
 * Guest order tracking: needs both the order number and the email used for the order.
 * Returns progress and items only — never the street address or phone number.
 */
export async function trackOrder(orderNumber: string, email: string) {
  const order = await db.order.findFirst({
    where: { orderNumber: orderNumber.trim().toUpperCase(), email: { equals: email.trim(), mode: "insensitive" } },
    include: { items: { select: { id: true, name: true, qty: true, image: true, unitPrice: true } }, shipment: true },
  });
  if (!order) return null;

  const address = order.address as unknown as OrderAddress;
  const placedAt = order.placedAt ?? (order.paymentStatus === "paid" ? order.createdAt : null);
  const open = order.status === "placed" || order.status === "packed" || order.status === "shipped";
  const window = open && placedAt ? deliveryWindow(placedAt) : null;
  const iso = (d: Date | null | undefined) => d?.toISOString() ?? null;

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    steps: { placed: iso(placedAt), packed: iso(order.packedAt), shipped: iso(order.shippedAt), delivered: iso(order.deliveredAt), cancelled: iso(order.cancelledAt) },
    expected: window ? { from: window.from.toISOString(), to: window.to.toISOString() } : null,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    codFee: order.codFee,
    cashDue: order.paymentMethod === "cod" && order.paymentStatus !== "paid" ? order.total - order.codFee : 0,
    total: order.total,
    recipient: address.name.split(" ")[0],
    deliverTo: `${address.city}, ${address.state} ${address.pincode}`,
    courier: order.shipment?.courier ?? null,
    awbNumber: order.shipment?.awbNumber ?? null,
    trackingUrl: order.shipment?.trackingUrl ?? null,
  };
}

export type TrackedOrder = NonNullable<Awaited<ReturnType<typeof trackOrder>>>;

export async function listOrdersForUser(userId: string) {
  return db.order.findMany({
    where: { userId, status: { not: "pending_payment" } },
    orderBy: { createdAt: "desc" },
    include: { items: { take: 3 }, _count: { select: { items: true } } },
  });
}

export async function getAddresses(userId: string) {
  return db.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { id: "desc" }] });
}
