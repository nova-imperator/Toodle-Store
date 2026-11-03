import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/server/auth/admin";
import { listOrders } from "@/server/services/admin/orders";
import { OrderPill, Pager, dateTime, listHref } from "@/components/admin/AdminBits";
import { ORDER_STATUS_LABEL } from "@/config/orders";
import { formatPaise } from "@/lib/money";
import styles from "../../admin.module.css";

export const metadata = { title: "Orders" };

const TABS: (OrderStatus | undefined)[] = [undefined, "cod_enquiry", "placed", "packed", "shipped", "delivered", "cancelled"];

type SP = { status?: string; q?: string; page?: string };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin("orders");
  const sp = await searchParams;
  const status = TABS.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageCount } = await listOrders({ status, q: sp.q?.trim(), page });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>{status === "cod_enquiry" ? "COD enquiries" : "Orders"}</h1>
          <p className={styles.sub}>
            {total} {total === 1 ? "order" : "orders"}
            {status === "cod_enquiry" && " waiting for a confirmation call"}
          </p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} aria-label="Filter by status">
          {TABS.map((t) => (
            <Link key={t ?? "all"} href={listHref("/admin/orders", { status: t, q: sp.q })} aria-current={t === status ? "true" : undefined}>
              {t ? ORDER_STATUS_LABEL[t] : "All"}
            </Link>
          ))}
        </nav>
        <form>
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={sp.q} placeholder="Order no., email or phone" aria-label="Search orders" />
        </form>
      </div>

      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No orders here.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Order</th><th>Placed</th><th>Customer</th><th>Items</th><th>Payment</th><th>Status</th><th className={styles.num}>Total</th></tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link></td>
                  <td>{dateTime.format(o.createdAt)}</td>
                  <td>{(o.address as { name?: string }).name}<br /><small>{o.phone}</small></td>
                  <td>{o._count.items}</td>
                  <td>{o.paymentMethod === "cod" ? "COD" : o.paymentStatus}</td>
                  <td><OrderPill status={o.status} /></td>
                  <td className={styles.num}>{formatPaise(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={page} pageCount={pageCount} href={(p) => listHref("/admin/orders", { status, q: sp.q, page: p })} />
    </>
  );
}
