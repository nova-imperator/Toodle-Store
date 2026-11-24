import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import { RANGES, listUnpaidCheckouts, type RangeKey } from "@/server/services/admin/analytics";
import type { OrderAddress } from "@/server/services/order";
import { dateTime } from "@/components/admin/AdminBits";
import { formatPaise } from "@/lib/money";
import styles from "../../admin.module.css";

export const metadata = { title: "Unpaid checkouts" };

/**
 * People who filled in checkout and pressed Pay but didn't finish paying (owner: "so we can call them").
 * Anyone who placed a real order afterwards is left out.
 */
export default async function CheckoutsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireAdmin("orders");
  const { range: r } = await searchParams;
  const range: RangeKey = r && r in RANGES ? (r as RangeKey) : "7d";
  const rows = await listUnpaidCheckouts(range);

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Unpaid checkouts</h1>
          <p className={styles.sub}>
            {rows.length} {rows.length === 1 ? "person" : "people"} entered their details but didn&apos;t pay. Call or WhatsApp them to help finish the order.
          </p>
        </div>
        <Link href="/admin/orders">All orders</Link>
      </div>
      <nav className={styles.tabs} aria-label="Period">
        {(Object.keys(RANGES) as RangeKey[]).map((k) => (
          <Link key={k} href={`/admin/checkouts?range=${k}`} aria-current={k === range ? "true" : undefined}>
            {RANGES[k]}
          </Link>
        ))}
      </nav>
      <div className={styles.tableWrap} style={{ marginTop: 14 }}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No unpaid checkouts in this period.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>When</th><th>Customer</th><th>Phone</th><th>Items</th><th className={styles.num}>Amount</th><th>Payment</th></tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const a = o.address as unknown as OrderAddress;
                const name = a.name || o.user.name || "";
                const first = name.split(" ")[0];
                const wa = `https://wa.me/91${o.phone}?text=${encodeURIComponent(
                  `Hi${first ? ` ${first}` : ""}, this is Toodle Store. We noticed your order wasn't completed. Can we help you finish it?`,
                )}`;
                return (
                  <tr key={o.id}>
                    <td>{dateTime.format(o.createdAt)}</td>
                    <td className={styles.wrap}>
                      {name || "—"}
                      <br />
                      <small>{o.email}</small>
                      <br />
                      <small>{a.city}{a.pincode ? ` ${a.pincode}` : ""}</small>
                    </td>
                    <td>
                      <a href={`tel:+91${o.phone}`}>{o.phone}</a>
                      <br />
                      <a href={wa} target="_blank" rel="noopener">WhatsApp</a>
                    </td>
                    <td className={styles.wrap}>
                      {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                    </td>
                    <td className={styles.num}>{formatPaise(o.total)}</td>
                    <td>
                      {o.paymentMethod === "cod" ? "COD" : "Online"}
                      {o.paymentStatus === "failed" && <><br /><span className={styles.pill} data-tone="red">payment failed</span></>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
