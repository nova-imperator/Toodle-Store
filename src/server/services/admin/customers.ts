import "server-only";
import { db } from "@/server/db";
import { ADMIN_PAGE } from "./orders";

export async function listCustomers({ q, page = 1 }: { q?: string; page?: number }) {
  const where = q ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }, { phone: { contains: q } }] } : {};
  const [rows, total] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * ADMIN_PAGE, take: ADMIN_PAGE, include: { _count: { select: { orders: true } } } }),
    db.user.count({ where }),
  ]);
  const spent = await db.order.groupBy({ by: ["userId"], where: { userId: { in: rows.map((r) => r.id) }, paymentStatus: "paid" }, _sum: { total: true } });
  return {
    rows: rows.map((r) => ({ ...r, spent: spent.find((s) => s.userId === r.id)?._sum.total ?? 0 })),
    total,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE)),
  };
}

export function getCustomer(id: string) {
  return db.user.findUnique({ where: { id }, include: { addresses: true, orders: { orderBy: { createdAt: "desc" }, where: { status: { not: "pending_payment" } } } } });
}
