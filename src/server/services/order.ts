import "server-only";
import { randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { getCart, clearCart } from "./cart";
import { sendCodEnquiryReceived, sendOrderConfirmation } from "./notifications";
import { createRazorpayOrder, isMockPayments, publicKeyId } from "@/server/integrations/razorpay";
import { includedGst } from "@/lib/money";
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

export type PlaceOrderResult =
  | { kind: "cod"; orderNumber: string }
  | { kind: "razorpay"; orderNumber: string; keyId: string; razorpayOrderId: string; amount: number; mock: boolean };

export async function placeOrder(user: { id: string; email: string; name: string | null }, input: CheckoutInput): Promise<PlaceOrderResult> {
  const cart = await getCart();
  if (cart.lines.length === 0) throw new AppError("cart_empty", "Your cart is empty.", 400);

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
  const scale = totals.subtotal ? totals.total / totals.subtotal : 0;
  const address = { ...input.address, line2: input.address.line2 || null, landmark: input.address.landmark || null };
  const orderNumber = newOrderNumber();
  const isCod = input.paymentMethod === "cod";

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: user.id,
      email: user.email,
      phone: input.phone,
      address: address as Prisma.InputJsonValue,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: 0,
      gst: totals.gstIncluded,
      total: totals.total,
      paymentMethod: input.paymentMethod,
      status: isCod ? "cod_enquiry" : "pending_payment",
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

  if (isCod) {
    await clearCart(user.id);
    await sendCodEnquiryReceived({ orderNumber, email: user.email, total: order.total, items: order.items, address });
    return { kind: "cod", orderNumber };
  }

  const rp = await createRazorpayOrder(order.total, orderNumber, { order_number: orderNumber });
  await db.payment.create({ data: { orderId: order.id, razorpayOrderId: rp.id, amount: order.total } });
  return { kind: "razorpay", orderNumber, keyId: publicKeyId(), razorpayOrderId: rp.id, amount: order.total, mock: isMockPayments() };
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
    await tx.order.update({ where: { id: order.id }, data: { status: "placed", paymentStatus: "paid" } });
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
