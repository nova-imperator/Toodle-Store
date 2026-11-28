import Link from "next/link";
import type { EnquiryStatus } from "@prisma/client";
import { requireAdmin } from "@/server/auth/admin";
import { b2bPinEnabled, isB2bUnlocked } from "@/server/auth/b2bPin";
import { B2bPinGate } from "@/components/admin/B2bPinGate";
import { lockB2bAction } from "../actions";
import { markSeen } from "@/server/services/admin/badges";
import { listEnquiries } from "@/server/services/admin/enquiries";
import { EnquiryPill, Pager, dateTime, listHref } from "@/components/admin/AdminBits";
import { ENQUIRY_STATUS_LABEL } from "@/config/orders";
import styles from "../../admin.module.css";

export const metadata = { title: "B2B enquiries" };

const TABS = Object.keys(ENQUIRY_STATUS_LABEL) as EnquiryStatus[];

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const admin = await requireAdmin("enquiries");
  if (!(await isB2bUnlocked(admin.id))) return <B2bPinGate next="/admin/enquiries" />;
  await markSeen(admin.id, "enquiries"); // clears this list's sidebar badge
  const sp = await searchParams;
  const status = TABS.includes(sp.status as EnquiryStatus) ? (sp.status as EnquiryStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageCount } = await listEnquiries({ status, q: sp.q?.trim(), page });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>B2B enquiries</h1>
          <p className={styles.sub}>{total} enquiries</p>
        </div>
        <div className={styles.headLinks}>
          <a href={listHref("/admin/enquiries/export", { status, q: sp.q })} download>
            Export to Excel (CSV)
          </a>
          {b2bPinEnabled() && (
            <form action={lockB2bAction}>
              <button type="submit" className={styles.linkBtn}>Lock</button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} aria-label="Filter by status">
          <Link href={listHref("/admin/enquiries", { q: sp.q })} aria-current={!status ? "true" : undefined}>All</Link>
          {TABS.map((t) => (
            <Link key={t} href={listHref("/admin/enquiries", { status: t, q: sp.q })} aria-current={t === status ? "true" : undefined}>
              {ENQUIRY_STATUS_LABEL[t]}
            </Link>
          ))}
        </nav>
        <form>
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={sp.q} placeholder="Name, business, city, phone" aria-label="Search enquiries" />
        </form>
      </div>

      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No enquiries here yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Received</th><th>Name</th><th>Business</th><th>Location</th><th>Order value</th><th>Status</th><th>Assigned</th></tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td>{dateTime.format(e.createdAt)}</td>
                  <td><Link href={`/admin/enquiries/${e.id}`}>{e.fullName ?? "No name"}</Link><br /><small>{e.phone}</small></td>
                  <td>{e.businessName ?? "—"}{e.businessType && <><br /><small>{e.businessType}</small></>}</td>
                  <td>{[e.city, e.state].filter(Boolean).join(", ") || "—"}</td>
                  <td>{e.estOrderValue ?? "—"}</td>
                  <td><EnquiryPill status={e.status} /></td>
                  <td>{e.assignee?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={page} pageCount={pageCount} href={(p) => listHref("/admin/enquiries", { status, q: sp.q, page: p })} />
    </>
  );
}
