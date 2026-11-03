import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import { getDashboard } from "@/server/services/admin/dashboard";
import { OrderPill, dateTime } from "@/components/admin/AdminBits";
import { formatPaise } from "@/lib/money";
import styles from "../admin.module.css";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const admin = await requireAdmin("dashboard");
  const d = await getDashboard();
  const { denied } = await searchParams;

  const stats = [
    { label: "Orders today", value: d.todayOrders, href: "/admin/orders", color: "blue" },
    { label: "Paid revenue today", value: formatPaise(d.todayRevenue), href: "/admin/orders", color: "green" },
    { label: "To pack and ship", value: d.pendingShipments, href: "/admin/orders?status=placed", color: "orange" },
    { label: "COD enquiries", value: d.codEnquiries, href: "/admin/orders?status=cod_enquiry", color: "yellow" },
    { label: "New B2B enquiries", value: d.newEnquiries, href: "/admin/enquiries?status=new", color: "red" },
  ];

  return (
    <>
      {denied && <p className={styles.banner}>Your role doesn&apos;t have access to that page.</p>}
      <div className={styles.pageHead}>
        <div>
          <h1>Good to see you, {admin.name.split(" ")[0]}</h1>
          <p className={styles.sub}>Here&apos;s the store today.</p>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={styles.stat} data-color={s.color}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

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
