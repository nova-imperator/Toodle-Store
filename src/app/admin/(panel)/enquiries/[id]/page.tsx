import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/admin";
import { getEnquiry, listAssignees } from "@/server/services/admin/enquiries";
import { EnquiryPill, dateTime } from "@/components/admin/AdminBits";
import { EnquiryEditor } from "@/components/admin/EnquiryEditor";
import { CATEGORIES } from "@/config/catalogue";
import styles from "../../../admin.module.css";

export const metadata = { title: "Enquiry" };

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("enquiries");
  const [e, assignees] = await Promise.all([getEnquiry((await params).id), listAssignees()]);
  if (!e) notFound();
  const cats = Array.isArray(e.categories) ? e.categories.map((s) => CATEGORIES.find((c) => c.slug === s)?.name ?? String(s)) : [];
  const wa = `https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hi ${e.fullName.split(" ")[0]}, this is Toodle Store about your wholesale enquiry.`)}`;

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>{e.businessName ?? e.fullName}</h1>
          <p className={styles.sub}>
            {dateTime.format(e.createdAt)} · <EnquiryPill status={e.status} />
          </p>
        </div>
        <Link href="/admin/enquiries">All enquiries</Link>
      </div>

      <div className={styles.cols}>
        <section className={styles.panel}>
          <h2>Details</h2>
          <dl className={styles.dl}>
            <dt>Name</dt><dd>{e.fullName}</dd>
            <dt>Mobile</dt><dd><a href={`tel:+91${e.phone}`}>{e.phone}</a> · <a href={wa} target="_blank" rel="noopener">WhatsApp</a></dd>
            <dt>Email</dt><dd><a href={`mailto:${e.email}`}>{e.email}</a></dd>
            <dt>Business</dt><dd>{e.businessName ?? "—"} ({e.businessType})</dd>
            <dt>Location</dt><dd>{e.city}, {e.state}</dd>
            <dt>GSTIN</dt><dd>{e.gstNumber ?? "—"}</dd>
            <dt>Categories</dt><dd>{cats.length ? cats.join(", ") : "—"}</dd>
            <dt>Order value</dt><dd>{e.estOrderValue ?? "—"}</dd>
            <dt>Message</dt><dd>{e.message ?? "—"}</dd>
            <dt>Source</dt><dd>{e.sourcePage ?? "—"}</dd>
            <dt>Campaign</dt><dd>{[e.utmSource, e.utmMedium, e.utmCampaign].filter(Boolean).join(" / ") || "—"}</dd>
          </dl>
        </section>
        <section className={styles.panel}>
          <h2>Follow-up</h2>
          <EnquiryEditor id={e.id} status={e.status} assignedTo={e.assignedTo} notes={e.notes} assignees={assignees} />
        </section>
      </div>
    </>
  );
}
