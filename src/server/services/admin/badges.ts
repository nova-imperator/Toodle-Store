import "server-only";
import type { AdminRole } from "@prisma/client";
import { db } from "@/server/db";
import { canAccess } from "@/server/auth/admin";

/** Sidebar badge keys = the admin list each one belongs to. */
export type BadgeKey = "orders" | "enquiries" | "customers";
export type BadgeCounts = Record<BadgeKey, number>;

const SEEN_FIELD = { orders: "seenOrdersAt", enquiries: "seenEnquiriesAt", customers: "seenCustomersAt" } as const;

/**
 * New since this admin last opened each list: paid/confirmed orders (not abandoned checkouts),
 * B2B enquiries and customer sign-ups. Lists the admin's role can't open count as 0.
 */
export async function badgeCounts(adminId: string, role: AdminRole): Promise<BadgeCounts> {
  const me = await db.adminUser.findUnique({ where: { id: adminId }, select: { seenOrdersAt: true, seenEnquiriesAt: true, seenCustomersAt: true } });
  if (!me) return { orders: 0, enquiries: 0, customers: 0 };
  const [orders, enquiries, customers] = await Promise.all([
    canAccess(role, "orders") ? db.order.count({ where: { createdAt: { gt: me.seenOrdersAt }, status: { not: "pending_payment" } } }) : 0,
    canAccess(role, "enquiries") ? db.b2bEnquiry.count({ where: { createdAt: { gt: me.seenEnquiriesAt } } }) : 0,
    canAccess(role, "customers") ? db.user.count({ where: { createdAt: { gt: me.seenCustomersAt } } }) : 0,
  ]);
  return { orders, enquiries, customers };
}

/** Called when an admin opens a list: clears that badge for them. */
export async function markSeen(adminId: string, key: BadgeKey) {
  await db.adminUser.update({ where: { id: adminId }, data: { [SEEN_FIELD[key]]: new Date() } });
}
