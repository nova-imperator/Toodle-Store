import "server-only";
import { db } from "@/server/db";

export async function getDashboard() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayOrders, todayRevenue, pendingShipments, codEnquiries, newEnquiries, recentOrders, lowStock] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: startOfDay }, status: { notIn: ["pending_payment"] } } }),
    db.order.aggregate({ where: { createdAt: { gte: startOfDay }, paymentStatus: "paid" }, _sum: { total: true } }),
    db.order.count({ where: { status: { in: ["placed", "packed"] } } }),
    db.order.count({ where: { status: "cod_enquiry" } }),
    db.b2bEnquiry.count({ where: { status: "new" } }),
    db.order.findMany({ where: { status: { not: "pending_payment" } }, orderBy: { createdAt: "desc" }, take: 8 }),
    db.product.findMany({ where: { status: "active", stockQty: { lte: 5 } }, orderBy: { stockQty: "asc" }, take: 8, select: { id: true, name: true, stockQty: true, sku: true } }),
  ]);

  return { todayOrders, todayRevenue: todayRevenue._sum.total ?? 0, pendingShipments, codEnquiries, newEnquiries, recentOrders, lowStock };
}
