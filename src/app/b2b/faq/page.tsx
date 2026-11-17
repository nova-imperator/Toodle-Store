import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { CtaBand, Faq } from "@/components/b2b/B2BSections";
import styles from "../b2b.module.css";

export const metadata: Metadata = pageSeo({
  title: "Wholesale FAQ – Pricing, Delivery and GST",
  description: "Answers about wholesale toy pricing, minimum order, delivery time, GST invoices, samples and returns.",
  path: "/b2b/faq",
  site: "b2b"
});

export default function B2BFaqPage() {
  return (
    <>
      <div className={`container ${styles.page}`}>
        <h1>Wholesale questions, answered</h1>
      </div>
      <Faq />
      <CtaBand source="b2b-faq-cta" />
    </>
  );
}
