import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ContentPage } from "@/components/content/Prose";
import { SITE, WHATSAPP_RETAIL_HREF } from "@/config/site";
import { EXCHANGE_POLICY } from "@/config/policy";

export const metadata: Metadata = pageSeo({
  title: "Return and Exchange Policy",
  description: "No refunds at Toodle Store: if a toy arrives damaged, defective or wrong, we exchange or replace it free of charge. How to report a problem.",
  path: "/return-policy",
});

const HOURS = EXCHANGE_POLICY.reportWithinHours;

export default function ReturnPolicyPage() {
  return (
    <ContentPage title="Return and exchange policy" path="/return-policy" updated="24 November 2026">
      <p>
        We want every toy to arrive in perfect shape. We don&apos;t give money refunds, but if something is wrong with your order we&apos;ll put it right
        with an exchange or a replacement.
      </p>

      <h2>When we exchange or replace</h2>
      <ul>
        <li>The toy arrived damaged or broken.</li>
        <li>The toy doesn&apos;t work (a manufacturing defect).</li>
        <li>You received a different item from the one you ordered, or something is missing.</li>
      </ul>
      <p>In these cases we send you a replacement of the same toy at no extra cost. If it&apos;s out of stock, you can choose another toy of the same value.</p>

      <h2>When we can&apos;t exchange</h2>
      <ul>
        <li>You changed your mind, or the toy isn&apos;t the size, colour or age range you expected. Please check the product page before ordering.</li>
        <li>The toy was damaged after delivery, by use, or by not following the instructions.</li>
        <li>The problem is reported more than {HOURS} hours after delivery.</li>
        <li>Minor differences in packaging or colour from the photos.</li>
      </ul>

      <h2>How to report a problem</h2>
      <ol>
        <li>
          Within <strong>{HOURS} hours of delivery</strong>, <a href={WHATSAPP_RETAIL_HREF} target="_blank" rel="noopener">WhatsApp us on {SITE.phone}</a> or email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your order number.
        </li>
        <li>Send clear photos of the item and the outer box, and an unboxing video if you have one. This helps us approve it quickly.</li>
        <li>Keep the toy and all its packaging and accessories. We&apos;ll arrange pickup or tell you how to send it back.</li>
        <li>Once we receive and check the item, we dispatch the replacement.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        We don&apos;t refund money for delivered orders. The only time money is returned is when <strong>we</strong> cancel an order before it ships,
        for example because a toy went out of stock or a price was shown in error. Then we refund what you paid online to your original payment method
        through Razorpay, usually within 5–7 working days depending on your bank.
      </p>

      <h2>Cancelling an order</h2>
      <p>If you need to cancel an order, contact us on WhatsApp or email as soon as possible, before it ships. Once an order has shipped it can&apos;t be cancelled.</p>
    </ContentPage>
  );
}
