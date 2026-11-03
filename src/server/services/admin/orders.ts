import "server-only";
import type { OrderStatus, Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { createRefund } from "@/server/integrations/razorpay";
import { sendOrderStatusUpdate } from "@/server/services/notifications";

export const ADMIN_PAGE = 30;

export async function listOrders({ status, q, page = 1 }: { status?: OrderStatus; q?: string; page?: number }) {
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : { status: { not: "pending_payment" } }),
    ...(q ? { OR: [{ orderNumber: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {}),
  };
  const [rows, total] = await Promise.all([
    db.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * ADMIN_PAGE, take: ADMIN_PAGE, include: { _count: { select: { items: true } } } }),
    db.order.count({ where }),
  ]);
  return { rows, total, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE)) };
}

export function getOrder(id: string) {
  return db.order.findUnique({ where: { id }, include: { items: true, payments: true, refunds: true, shipment: true, user: true } });
}

// Allowed manual moves. COD enquiries are confirmed through confirmCod so stock is checked.
const NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  placed: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  cod_enquiry: ["cancelled"],
};

export function allowedNext(status: OrderStatus): OrderStatus[] {
  return NEXT[status] ?? [];
}

export async function updateOrderStatus(id: string, status: OrderStatus, shipment?: { courier?: string; awbNumber?: string; trackingUrl?: string }) {
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) throw new AppError("not_found", "Order not found", 404);
  if (!allowedNext(order.status).includes(status)) throw new AppError("bad_transition", `Can't move an order from ${order.status} to ${status}.`);

  await db.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status } });
    if (status === "shipped") {
      const data = { courier: shipment?.courier || null, awbNumber: shipment?.awbNumber || null, trackingUrl: shipment?.trackingUrl || null, status: "shipped" };
      await tx.shipment.upsert({ where: { orderId: id }, update: data, create: { orderId: id, ...data } });
    }
    if (status === "delivered") await tx.shipment.updateMany({ where: { orderId: id }, data: { status: "delivered" } });
    // Paid orders cancelled before shipping return their stock.
    if (status === "cancelled" && order.paymentStatus === "paid") {
      for (const i of order.items) if (i.productId) await tx.product.update({ where: { id: i.productId }, data: { stockQty: { increment: i.qty } } });
    }
  });

  await sendOrderStatusUpdate({ orderNumber: order.orderNumber, email: order.email, status, trackingUrl: shipment?.trackingUrl });
}

/** After the team calls the shopper: COD enquiry becomes a real order and stock is reserved. */
export async function confirmCod(id: string) {
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order || order.status !== "cod_enquiry") throw new AppError("bad_state", "Only COD enquiries can be confirmed.");
  await db.$transaction(async (tx) => {
    for (const i of order.items) {
      if (!i.productId) continue;
      const updated = await tx.product.updateMany({ where: { id: i.productId, stockQty: { gte: i.qty } }, data: { stockQty: { decrement: i.qty } } });
      if (updated.count === 0) throw new AppError("insufficient_stock", `Not enough stock for ${i.name}.`, 409);
    }
    await tx.order.update({ where: { id }, data: { status: "placed" } });
  });
  await sendOrderStatusUpdate({ orderNumber: order.orderNumber, email: order.email, status: "placed" });
}

/** Manual refund for exceptions (store policy is no returns). Full amount of the captured payment. */
export async function refundOrder(id: string) {
  const order = await db.order.findUnique({ where: { id }, include: { payments: true } });
  const payment = order?.payments.find((p) => p.status === "paid" && p.razorpayPaymentId);
  if (!order || !payment) throw new AppError("not_refundable", "This order has no captured online payment to refund.");
  const refund = await createRefund(payment.razorpayPaymentId!, payment.amount);
  await db.$transaction([
    db.refund.create({ data: { orderId: id, paymentId: payment.id, razorpayRefundId: refund.id, amount: payment.amount, status: refund.status } }),
    db.payment.update({ where: { id: payment.id }, data: { status: "refunded" } }),
    db.order.update({ where: { id }, data: { paymentStatus: "refunded" } }),
  ]);
}
