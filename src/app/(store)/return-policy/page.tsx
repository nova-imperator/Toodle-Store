import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ContentPage } from "@/components/content/Prose";
import { SITE, WHATSAPP_RETAIL_HREF } from "@/config/site";
import { EXCHANGE_POLICY } from "@/config/policy";

export const metadata: Metadata = pageSeo({
  title: "Return, Exchange and Refund Policy",
  description:
    "Damaged, defective, wrong or missing toys are replaced, exchanged or refunded if reported within 48 hours of delivery with unboxing photos or video. How to report a problem.",
  path: "/return-policy",
});

const HOURS = EXCHANGE_POLICY.reportWithinHours;

export default function ReturnPolicyPage() {
  return (
    <ContentPage title="Return, exchange and refund policy" path="/return-policy" updated="28 November 2026">
      <p>
        We want every toy to arrive in perfect shape. If something is wrong with your order, we&apos;ll put it right. Please read below what is
        covered and how to report it.
      </p>

      <h2>When you get a replacement, exchange or refund</h2>
      <p>
        <strong>Refunds and exchanges are available for damaged, defective, wrong or missing items</strong>, if you report the problem within{" "}
        <strong>{HOURS} hours of delivery</strong> with unboxing photos or video. This covers:
      </p>
      <ul>
        <li>The toy arrived damaged or broken.</li>
        <li>The toy doesn&apos;t work (a manufacturing defect).</li>
        <li>You received a different item from the one you ordered.</li>
        <li>An item or part is missing from your order.</li>
      </ul>
      <p>
        We first offer a free replacement or an exchange for another toy of the same value. If that isn&apos;t possible, or you prefer it, we refund
        the amount you paid for that item.
      </p>

      <h2>When returns, exchanges and refunds don&apos;t apply</h2>
      <ul>
        <li>Change of mind, or you no longer want the toy.</li>
        <li>You ordered the wrong size, colour or age range. Please check the product page before ordering.</li>
        <li>The toy was damaged after delivery, through use, misuse or not following the instructions.</li>
        <li>The problem is reported more than {HOURS} hours after delivery, or without unboxing photos or video.</li>
        <li>Minor differences in packaging or colour from the photos.</li>
      </ul>

      <h2>How to report a problem</h2>
      <ol>
        <li>
          Within <strong>{HOURS} hours of delivery</strong>,{" "}
          <a href={WHATSAPP_RETAIL_HREF} target="_blank" rel="noopener">
            WhatsApp us on {SITE.phone}
          </a>{" "}
          or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your order number.
        </li>
        <li>Send clear photos of the item and the outer box, and the unboxing video if you recorded one.</li>
        <li>Keep the toy with all its packaging and accessories. We&apos;ll arrange a pickup or tell you how to send it back.</li>
        <li>Once we receive and check it, we send the replacement or exchange, or process your refund.</li>
      </ol>

      <h2>How refunds are paid</h2>
      <p>
        Approved refunds go back to your original payment method through Razorpay, usually within 5–7 working days depending on your bank. For cash on
        delivery orders we refund by UPI or bank transfer to the account you give us.
      </p>

      <h2>Orders we cancel</h2>
      <p>
        If we cancel an order before it ships, for example because a toy went out of stock or a price was shown in error, we refund everything you paid
        online in full.
      </p>

      <h2>Cancelling an order</h2>
      <p>
        If you need to cancel, contact us on WhatsApp or email as soon as possible, before the order ships. Once an order has shipped it can&apos;t be
        cancelled.
      </p>
    </ContentPage>
  );
}
