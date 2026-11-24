import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import { getDashboard } from "@/server/services/admin/dashboard";
import { RANGES, getAnalytics, getDaily, type RangeKey } from "@/server/services/admin/analytics";
import { OrderPill, dateTime } from "@/components/admin/AdminBits";
import { formatPaise } from "@/lib/money";
import styles from "../admin.module.css";

const dayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string; range?: string }> }) {
  const admin = await requireAdmin("dashboard");
  const { denied, range: r } = await searchParams;
  const range: RangeKey = r && r in RANGES ? (r as RangeKey) : "7d";
  const [d, a, daily] = await Promise.all([getDashboard(), getAnalytics(range), getDaily(range === "30d" || range === "all" ? 30 : 7)]);

  const groups: { title: string; stats: { label: string; value: string | number; hint?: string; href?: string; color: string }[] }[] = [
    {
      title: "Sales",
      stats: [
        { label: "Orders", value: a.orders, hint: "paid or COD confirmed", href: "/admin/orders", color: "blue" },
        { label: "Sales value", value: formatPaise(a.sales), hint: "total of those orders", color: "green" },
        { label: "Money received", value: formatPaise(a.received), hint: "paid online (incl. COD charges)", color: "green" },
        { label: "Average order", value: formatPaise(a.avgOrder), color: "yellow" },
      ],
    },
    {
      title: "Right now",
      stats: [
        { label: "To pack & ship", value: a.toShip, href: "/admin/orders?status=placed", color: "orange" },
        { label: "On the way", value: a.inTransit, href: "/admin/orders?status=shipped", color: "blue" },
        { label: "COD cash to collect", value: formatPaise(a.cashToCollect), color: "yellow" },
        { label: "Unpaid checkouts", value: a.unpaidCheckouts, hint: `${formatPaise(a.unpaidValue)} left unpaid – call them`, href: `/admin/checkouts?range=${range}`, color: "red" },
      ],
    },
    {
      title: "Visitors",
      stats: [
        { label: "Visitors", value: a.visitors, hint: "unique browsers", color: "blue" },
        { label: "Page views", value: a.pageViews, color: "blue" },
        { label: "Product views", value: a.productViews, color: "green" },
        { label: "Conversion", value: `${a.conversion}%`, hint: "orders ÷ visitors", color: "orange" },
      ],
    },
    {
      title: "People",
      stats: [
        { label: "New customers", value: a.newCustomers, href: "/admin/customers", color: "green" },
        { label: "B2B enquiries", value: a.enquiries, href: "/admin/enquiries", color: "red" },
        { label: "Cancelled orders", value: a.cancelled, href: "/admin/orders?status=cancelled", color: "yellow" },
      ],
    },
  ];

  return (
    <>
      {denied && <p className={styles.banner}>Your role doesn&apos;t have access to that page.</p>}
      <div className={styles.pageHead}>
        <div>
          <h1>Good to see you, {admin.name.split(" ")[0]}</h1>
          <p className={styles.sub}>Store numbers for: {RANGES[range].toLowerCase()} (India time).</p>
        </div>
      </div>
      <nav className={styles.tabs} aria-label="Period">
        {(Object.keys(RANGES) as RangeKey[]).map((k) => (
          <Link key={k} href={`/admin?range=${k}`} aria-current={k === range ? "true" : undefined}>
            {RANGES[k]}
          </Link>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.title} className={styles.statGroup} aria-label={g.title}>
          <h2>{g.title}</h2>
          <div className={styles.stats}>
            {g.stats.map((s) => {
              const body = (
                <>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                  {s.hint && <small>{s.hint}</small>}
                </>
              );
              return s.href ? (
                <Link key={s.label} href={s.href} className={styles.stat} data-color={s.color}>
                  {body}
                </Link>
              ) : (
                <div key={s.label} className={styles.stat} data-color={s.color}>
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className={styles.cols}>
        <section className={styles.panel}>
          <h2>Most viewed products</h2>
          {a.topViewed.length === 0 ? (
            <p className={styles.empty}>No product views yet.</p>
          ) : (
            <table className={styles.table}>
              <tbody>
                {a.topViewed.map((p) => (
                  <tr key={p.slug}>
                    <td className={styles.wrap}>{p.id ? <Link href={`/admin/products/${p.id}`}>{p.name}</Link> : p.name}</td>
                    <td className={styles.num}>{p.views} views</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className={styles.panel}>
          <h2>Best sellers</h2>
          {a.bestSellers.length === 0 ? (
            <p className={styles.empty}>No orders in this period.</p>
          ) : (
            <table className={styles.table}>
              <tbody>
                {a.bestSellers.map((p) => (
                  <tr key={p.name}>
                    <td className={styles.wrap}>{p.name}</td>
                    <td className={styles.num}>{p.qty} sold</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className={styles.panel}>
        <h2>Day by day</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Day</th><th className={styles.num}>Visitors</th><th className={styles.num}>Orders</th><th className={styles.num}>Sales</th></tr>
            </thead>
            <tbody>
              {daily.map((row) => (
                <tr key={row.day}>
                  <td>{dayLabel.format(new Date(`${row.day}T00:00:00Z`))}</td>
                  <td className={styles.num}>{row.visitors}</td>
                  <td className={styles.num}>{row.orders}</td>
                  <td className={styles.num}>{formatPaise(row.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.cols}>
        <section className={styles.panel}>
          <h2>Latest orders</h2>
          {d.recentOrders.length === 0 ? (
            <p className={styles.empty}>No orders yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>Order</th><th>When</th><th>Status</th><th className={styles.num}>Total</th></tr>
                </thead>
                <tbody>
                  {d.recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td><Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link></td>
                      <td>{dateTime.format(o.createdAt)}</td>
                      <td><OrderPill status={o.status} /></td>
                      <td className={styles.num}>{formatPaise(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <h2>Low stock</h2>
          {d.lowStock.length === 0 ? (
            <p className={styles.empty}>Everything is well stocked.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <tbody>
                  {d.lowStock.map((p) => (
                    <tr key={p.id}>
                      <td className={styles.wrap}><Link href={`/admin/products/${p.id}`}>{p.name}</Link></td>
                      <td className={styles.num}>
                        <span className={styles.pill} data-tone={p.stockQty === 0 ? "red" : "yellow"}>{p.stockQty} left</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
