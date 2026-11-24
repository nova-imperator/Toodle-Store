// One-time launch cleanup (owner, 24 Nov 2026: "remove all orders, payments, customers and enquiries – we go
// live from now"). Runs on every deploy but only touches rows created BEFORE the cutoff, so anything from
// real customers after launch is never affected. Safe to delete this file (and its line in scripts/build.mjs)
// once it has run on production.
import { PrismaClient } from "@prisma/client";

const CUTOFF = new Date("2026-11-24T20:30:00+05:30");

const prisma = new PrismaClient();

async function main() {
  const before = { lt: CUTOFF };
  const result = await prisma.$transaction(async (tx) => {
    const orders = await tx.order.findMany({ where: { createdAt: before }, select: { id: true } });
    const orderIds = orders.map((o) => o.id);
    await tx.refund.deleteMany({ where: { orderId: { in: orderIds } } });
    // Payments, items and shipments go with their order (onDelete: Cascade).
    const o = await tx.order.deleteMany({ where: { id: { in: orderIds } } });
    // Users take their sessions, addresses, cart, wishlist and reviews with them (onDelete: Cascade).
    const u = await tx.user.deleteMany({ where: { createdAt: before, orders: { none: {} } } });
    const e = await tx.b2bEnquiry.deleteMany({ where: { createdAt: before } });
    const c = await tx.cart.deleteMany({ where: { userId: null, updatedAt: before } });
    await tx.otpCode.deleteMany({ where: { createdAt: before } });
    // Test orders counted towards coupon limits; start from zero.
    if (o.count) await tx.coupon.updateMany({ data: { usedCount: 0 } });
    return { orders: o.count, customers: u.count, enquiries: e.count, guestCarts: c.count };
  });
  if (result.orders || result.customers || result.enquiries || result.guestCarts) {
    console.log(`Launch cleanup: removed ${result.orders} orders, ${result.customers} customers, ${result.enquiries} enquiries, ${result.guestCarts} guest carts.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
