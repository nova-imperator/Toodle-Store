import type { Metadata } from "next";
import { B2BHeader } from "@/components/b2b/B2BHeader";
import { UtmCapture } from "@/components/b2b/UtmCapture";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: { default: "Wholesale Toys Supplier in India – Bulk Orders", template: "%s | Toodle Store Wholesale" },
  description: "Wholesale toys for shops, resellers, schools and corporates. No minimum order, GST invoice, free delivery across India. Get the price list today.",
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <UtmCapture />
      <B2BHeader />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
