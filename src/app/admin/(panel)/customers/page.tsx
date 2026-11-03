import { requireAdmin } from "@/server/auth/admin";
import { listCustomers } from "@/server/services/admin/customers";
import { Pager, dateTime, listHref } from "@/components/admin/AdminBits";
import { formatPaise } from "@/lib/money";
import styles from "../../admin.module.css";

export const metadata = { title: "Customers" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdmin("customers");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageCount } = await listCustomers({ q: sp.q?.trim(), page });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Customers</h1>
          <p className={styles.sub}>{total} accounts</p>
        </div>
      </div>
      <div className={styles.toolbar}>
        <form>
          <input name="q" defaultValue={sp.q} placeholder="Name, email or phone" aria-label="Search customers" />
        </form>
      </div>
      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No customers yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Customer</th><th>Phone</th><th>Login</th><th>Joined</th><th>Last login</th><th className={styles.num}>Orders</th><th className={styles.num}>Paid total</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.name ?? "—"}<br /><small>{c.email}</small></td>
                  <td>{c.phone ?? "—"}</td>
                  <td>{c.googleId ? "Google" : "Email code"}</td>
                  <td>{dateTime.format(c.createdAt)}</td>
                  <td>{c.lastLoginAt ? dateTime.format(c.lastLoginAt) : "—"}</td>
                  <td className={styles.num}>{c._count.orders}</td>
                  <td className={styles.num}>{formatPaise(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={page} pageCount={pageCount} href={(p) => listHref("/admin/customers", { q: sp.q, page: p })} />
    </>
  );
}
