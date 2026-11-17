import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { B2BHero, Benefits, CtaBand, Faq, Segments, Steps, WholesaleCategories } from "@/components/b2b/B2BSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/config/site";

export const metadata: Metadata = pageSeo({
  title: {
    absolute: "Wholesale Toys Supplier in India – Bulk Orders | Toodle Store"
  },
  description: "Wholesale toys for shops, resellers, schools and corporates across 11 categories. No minimum order, GST invoice, delivery across India. Get the price list.",
  path: "/b2b",
  site: "b2b"
});

// Category photos come from the catalogue; refresh hourly so admin changes show without a redeploy.
export const revalidate = 3600;

export default function B2BLanding() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Wholesale toy supply",
          serviceType: "Bulk toy supply",
          areaServed: "IN",
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url, telephone: SITE.phone },
        }}
      />
      <B2BHero
        title="Start or stock your toy business with wholesale prices"
        text="Toys across 11 categories for shops, online sellers, schools and corporate buyers. Mix products freely, order any quantity, and get a GST invoice with delivery anywhere in India."
        source="b2b-hero"
      />
      <Segments />
      <Benefits />
      <WholesaleCategories />
      <Steps />
      <Faq />
      <CtaBand source="b2b-footer-cta" />
    </>
  );
}
