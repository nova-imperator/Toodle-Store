import "server-only";
import { Prisma, type OrderStatus } from "@prisma/client";
import { db } from "@/server/db";

export const RANGES = { today: "Today", "7d": "Last 7 days", "30d": "Last 30 days", all: "All time" } as const;
export type RangeKey = keyof typeof RANGES;

const IST_OFFSET_MS = 5.5 * 3600_000;

/** Midnight in India (IST), `daysAgo` days back, as a UTC Date. */
function istMidnight(daysAgo = 0) {
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  const midnightIst = Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate()) - daysAgo * 86_400_000;
  return new Date(midnightIst - IST_OFFSET_MS);
}

export function rangeStart(range: RangeKey): Date | null {
  if (range === "today") return istMidnight(0);
  if (range === "7d") return istMidnight(6);
  if (range === "30d") return istMidnight(29);
  return null;
}

// "Confirmed" = a real order: paid online, or COD with the COD charge paid. Not abandoned, not cancelled.
const CONFIRMED: OrderStatus[] = ["placed", "packed", "shipped", "delivered"];

export async function getAnalytics(range: RangeKey) {
  const from = rangeStart(range);
  const created = from ? { createdAt: { gte: from } } : {};

  const [confirmed, cancelled, unpaid, visitors, pageViews, productViews, newCustomers, enquiries, toShip, inTransit, codDue, topViewedRaw, bestSellersRaw] =
    await Promise.all([
      db.order.aggregate({ where: { ...created, status: { in: CONFIRMED } }, _count: true, _sum: { total: true } }),
      db.order.count({ where: { ...created, status: "cancelled" } }),
      db.order.aggregate({ where: { ...created, status: "pending_payment" }, _count: true, _sum: { total: true } }),
      db.pageView.findMany({ where: created, distinct: ["visitorId"], select: { visitorId: true } }).then((r) => r.length),
      db.pageView.count({ where: created }),
      db.pageView.count({ where: { ...created, productSlug: { not: null } } }),
      db.user.count({ where: created }),
      db.b2bEnquiry.count({ where: created }),
      // Work queues are "right now", not limited to the range.
      db.order.count({ where: { status: { in: ["placed", "packed"] } } }),
      db.order.count({ where: { status: "shipped" } }),
      db.order.findMany({ where: { paymentMethod: "cod", paymentStatus: "unpaid", status: { in: ["placed", "packed", "shipped"] } }, select: { total: true, codFee: true } }),
      db.pageView.groupBy({ by: ["productSlug"], where: { ...created, productSlug: { not: null } }, _count: { _all: true }, orderBy: { _count: { productSlug: "desc" } }, take: 5 }),
      db.orderItem.groupBy({ by: ["name"], where: { order: { ...created, status: { in: CONFIRMED } } }, _sum: { qty: true, unitPrice: true }, orderBy: { _sum: { qty: "desc" } }, take: 5 }),
    ]);

  // Money actually received online: fully paid orders + COD charges paid up front on unpaid COD orders.
  const [paidOnline, codFeesPaid] = await Promise.all([
    db.order.aggregate({ where: { ...created, paymentStatus: "paid" }, _sum: { total: true } }),
    db.order.aggregate({ where: { ...created, paymentMethod: "cod", paymentStatus: "unpaid", status: { in: CONFIRMED } }, _sum: { codFee: true } }),
  ]);

  const slugs = topViewedRaw.map((r) => r.productSlug!).filter(Boolean);
  const names = await db.product.findMany({ where: { slug: { in: slugs } }, select: { slug: true, name: true, id: true } });

  const orders = confirmed._count;
  const sales = confirmed._sum.total ?? 0;
  return {
    orders,
    sales,
    received: (paidOnline._sum.total ?? 0) + (codFeesPaid._sum.codFee ?? 0),
    cashToCollect: codDue.reduce((s, o) => s + o.total - o.codFee, 0),
    avgOrder: orders ? Math.round(sales / orders) : 0,
    cancelled,
    unpaidCheckouts: unpaid._count,
    unpaidValue: unpaid._sum.total ?? 0,
    visitors,
    pageViews,
    productViews,
    conversion: visitors ? Math.round((orders / visitors) * 1000) / 10 : 0,
    newCustomers,
    enquiries,
    toShip,
    inTransit,
    topViewed: topViewedRaw.map((r) => {
      const p = names.find((n) => n.slug === r.productSlug);
      return { slug: r.productSlug!, name: p?.name ?? r.productSlug!, id: p?.id ?? null, views: r._count._all };
    }),
    bestSellers: bestSellersRaw.map((r) => ({ name: r.name, qty: r._sum.qty ?? 0 })),
  };
}

export interface DayRow {
  day: string;
  visitors: number;
  orders: number;
  sales: number;
}

/** Day-by-day numbers (IST days), newest first. */
export async function getDaily(days: number): Promise<DayRow[]> {
  const from = istMidnight(days - 1);
  const [views, orders] = await Promise.all([
    db.$queryRaw<{ day: string; visitors: bigint }[]>(Prisma.sql`
      SELECT to_char((created_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, COUNT(DISTINCT visitor_id) AS visitors
      FROM page_views WHERE created_at >= ${from} GROUP BY 1`),
    db.$queryRaw<{ day: string; orders: bigint; sales: bigint | null }[]>(Prisma.sql`
      SELECT to_char((created_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, COUNT(*) AS orders, SUM(total) AS sales
      FROM orders WHERE created_at >= ${from} AND status::text IN ('placed','packed','shipped','delivered') GROUP BY 1`),
  ]);
  const rows: DayRow[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(istMidnight(i).getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
    const v = views.find((x) => x.day === d);
    const o = orders.find((x) => x.day === d);
    rows.push({ day: d, visitors: Number(v?.visitors ?? 0), orders: Number(o?.orders ?? 0), sales: Number(o?.sales ?? 0) });
  }
  return rows;
}

/**
 * Checkouts where the customer entered their details and pressed Pay but never paid – for follow-up calls.
 * Hides people who placed a real order afterwards.
 */
export async function listUnpaidCheckouts(range: RangeKey) {
  const from = rangeStart(range);
  const rows = await db.order.findMany({
    where: { status: "pending_payment", ...(from ? { createdAt: { gte: from } } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: { select: { name: true, qty: true } }, user: { select: { name: true } } },
  });
  const later = await db.order.findMany({
    where: { userId: { in: rows.map((r) => r.userId) }, status: { in: CONFIRMED } },
    select: { userId: true, createdAt: true },
  });
  return rows.filter((r) => !later.some((l) => l.userId === r.userId && l.createdAt > r.createdAt));
}
