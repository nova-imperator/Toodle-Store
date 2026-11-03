import type { Metadata } from "next";
import { EnquiryForm } from "@/components/b2b/EnquiryForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import styles from "../b2b.module.css";

export const metadata: Metadata = {
  title: "Wholesale Enquiry – Get the Price List",
  description: "Tell us what you need and get Toodle Store's wholesale toy price list within 24 hours. No minimum order.",
  alternates: { canonical: "/b2b/enquiry" },
};

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const { source } = await searchParams;
  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs items={[{ name: "Wholesale", path: "/b2b" }, { name: "Enquiry", path: "/b2b/enquiry" }]} />
      <h1>Get the wholesale price list</h1>
      <p>Takes about a minute. Our team calls you within 24 hours with prices for the categories you choose.</p>
      <div className={styles.formCard}>
        <EnquiryForm source={source ? `enquiry-page:${source.slice(0, 40)}` : "enquiry-page"} />
      </div>
    </div>
  );
}
