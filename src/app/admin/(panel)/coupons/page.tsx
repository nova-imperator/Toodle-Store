import { requireAdmin } from "@/server/auth/admin";
import { listCoupons } from "@/server/services/admin/coupons";
import { CouponForm } from "@/components/admin/CouponForm";
import { toggleCouponAction } from "../actions";
import { formatPaise } from "@/lib/money";
import styles from "../../admin.module.css";

export const metadata = { title: "Coupons" };

const day = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function CouponsPage() {
  await requireAdmin("coupons");
  const coupons = await listCoupons();

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Coupons</h1>
      </div>
      <div className={styles.cols}>
        <div className={styles.tableWrap}>
          {coupons.length === 0 ? (
            <p className={styles.empty}>No coupons yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>Code</th><th>Discount</th><th>Min order</th><th>Expires</th><th className={styles.num}>Used</th><th /></tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.code}>
                    <td><strong>{c.code}</strong></td>
                    <td>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                    <td>{c.minOrder ? formatPaise(c.minOrder) : "—"}</td>
                    <td>{c.expiresAt ? day.format(c.expiresAt) : "Never"}</td>
                    <td className={styles.num}>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                    <td>
                      <form action={toggleCouponAction.bind(null, c.code, !c.isActive)}>
                        <button type="submit" className={styles.pill} data-tone={c.isActive ? "green" : "grey"}>
                          {c.isActive ? "Active · turn off" : "Off · turn on"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <section className={styles.panel}>
          <h2>New coupon</h2>
          <CouponForm />
        </section>
      </div>
    </>
  );
}
