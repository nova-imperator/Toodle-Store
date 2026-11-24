import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import { COD_FEE, FREE_SHIPPING_FROM, MIN_ORDER, SHIPPING_FEE } from "@/config/shipping";
import { EXCHANGE_POLICY, GRIEVANCE_CONTACT } from "@/config/policy";
import { formatPaise } from "@/lib/money";

export const metadata: Metadata = pageSeo({
  title: "Terms and Conditions",
  description: "Terms for shopping at Toodle Store: products, prices, payment online or cash on delivery, delivery within India, exchanges for damaged items and more.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage title="Terms and conditions" path="/terms" updated="24 November 2026">
      <p>
        These terms apply to everyone who visits the Toodle Store website or places an order with Toodle Store (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using
        the site or placing an order you agree to them. We may update these terms from time to time; the version on this page applies to your order.
      </p>

      <h2>1. Using the site</h2>
      <ul>
        <li>You must be 18 or older to place an order, or order with the help of a parent or guardian.</li>
        <li>Please give accurate contact and delivery details. We aren&apos;t responsible for delays caused by a wrong address or phone number.</li>
        <li>Don&apos;t misuse the site, for example by trying to break into accounts, copying content or placing fake orders.</li>
      </ul>

      <h2>2. Products</h2>
      <ul>
        <li>We try to show every toy accurately, but colours on your screen and packaging can differ slightly from the photos.</li>
        <li>Age guidance is shown on each product. Please follow it and the safety warnings on the toy and packaging. Small parts can be a choking hazard for young children; adult supervision is recommended.</li>
        <li>All products are subject to availability. We may limit quantities or stop selling a product at any time.</li>
      </ul>

      <h2>3. Prices and payment</h2>
      <ul>
        <li>All prices are in Indian rupees. The total you pay is shown at checkout before you pay.</li>
        <li>You can pay online through Razorpay (UPI, cards, netbanking, wallets) or choose cash on delivery.</li>
        <li>
          Cash on delivery costs {formatPaise(COD_FEE)} extra. This charge is paid online at checkout to confirm the order; the rest is paid in cash on
          delivery.
        </li>
        <li>The minimum order value is {formatPaise(MIN_ORDER)}.</li>
        <li>An order is confirmed only after the online payment succeeds. We never see or store your card or bank details.</li>
        <li>
          If a price or product detail was shown in error, or an item is out of stock, we may cancel the order. Anything you paid online is then refunded
          in full to your original payment method.
        </li>
      </ul>

      <h2>4. Delivery</h2>
      <p>
        We deliver only within India. Delivery is {formatPaise(SHIPPING_FEE)} per order, free on orders of {formatPaise(FREE_SHIPPING_FROM)} or more.
        Delivery times are estimates and depend on the courier. See our <Link href="/shipping-policy">shipping policy</Link>.
      </p>

      <h2>5. Exchanges and refunds</h2>
      <p>
        {EXCHANGE_POLICY.summary} Problems must be reported within {EXCHANGE_POLICY.reportWithinHours} hours of delivery. Full details are in our{" "}
        <Link href="/return-policy">return and exchange policy</Link>.
      </p>

      <h2>6. Cancellations</h2>
      <p>Contact us as soon as possible if you need to cancel an order. Orders that have already shipped can&apos;t be cancelled.</p>

      <h2>7. Coupons and offers</h2>
      <p>Coupons can&apos;t be exchanged for cash, can&apos;t be combined unless stated, and may have a minimum order value, usage limit or expiry date.</p>

      <h2>8. Our content</h2>
      <p>The text, photos, logo and design of this website belong to Toodle Store or are used with permission. Please don&apos;t copy or reuse them without our written permission.</p>

      <h2>9. Liability</h2>
      <p>
        To the extent the law allows, we aren&apos;t liable for indirect or consequential losses, and our total liability for any order is limited to the
        amount you paid for it. Nothing in these terms affects your rights as a consumer under Indian law.
      </p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>11. Contact and grievances</h2>
      <p>
        Questions or complaints: {SITE.email} · {SITE.phone} (call or WhatsApp). Our {GRIEVANCE_CONTACT.role} can be reached at the same email and will
        respond within {GRIEVANCE_CONTACT.replyWithinDays} days.
      </p>
    </ContentPage>
  );
}
