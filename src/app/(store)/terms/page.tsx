import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Terms and Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <ContentPage title="Terms and conditions" path="/terms" updated="2 November 2026">
      <p>These terms apply when you use toodlestore.in or place an order with {SITE.legalName}. By placing an order you agree to them.</p>
      <h2>Orders and prices</h2>
      <ul>
        <li>All prices are in Indian rupees and include GST.</li>
        <li>An online order is confirmed once payment is received. A cash on delivery request is confirmed only after our team calls you.</li>
        <li>We may cancel an order if an item is unavailable or a price was shown in error. Any payment is then refunded in full.</li>
      </ul>
      <h2>Delivery</h2>
      <p>
        Delivery is free across India. See our <Link href="/shipping-policy">shipping policy</Link> for timelines.
      </p>
      <h2>Returns</h2>
      <p>
        We don&apos;t accept returns or give refunds, except as described in our <Link href="/return-policy">return policy</Link>.
      </p>
      <h2>Toy safety</h2>
      <p>Please follow the age guidance and safety information on each product page. Adult supervision is recommended for young children.</p>
      <h2>Coupons</h2>
      <p>Coupons can&apos;t be exchanged for cash, can&apos;t be combined unless stated, and may have a minimum order value, usage limit or expiry date.</p>
      <h2>Contact</h2>
      <p>
        {SITE.legalName} · {SITE.email} · {SITE.phone}
      </p>
    </ContentPage>
  );
}
