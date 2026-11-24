import type { Metadata } from "next";
import { B2BHeader } from "@/components/b2b/B2BHeader";
import { UtmCapture } from "@/components/b2b/UtmCapture";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import styles from "./b2b.module.css";

export const metadata: Metadata = {
  title: { default: "Wholesale Toys Supplier in India – Bulk Orders", template: "%s | Toodle Store Wholesale" },
  description: "Wholesale toys for shops, resellers, schools and corporates. No minimum order, GST invoice, delivery across India. Get the price list today.",
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <UtmCapture />
      <Suspense>
        <VisitTracker />
      </Suspense>
      <div className={styles.theme}>
        <B2BHeader />
        <main id="main">{children}</main>
        <Footer plain />
      </div>
    </>
  );
}
