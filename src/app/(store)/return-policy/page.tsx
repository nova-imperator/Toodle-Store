import type { Metadata } from "next";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Return Policy", alternates: { canonical: "/return-policy" } };

export default function ReturnPolicyPage() {
  return (
    <ContentPage title="Return and refund policy" path="/return-policy" updated="2 November 2026">
      <h2>No returns or refunds</h2>
      <p>
        Toodle Store does not accept returns or offer refunds on orders. Please check the age range, size and details on the product page before
        ordering. If you&apos;re unsure, WhatsApp us on {SITE.phone} and we&apos;ll help you choose.
      </p>
      <h2>If we can&apos;t fulfil your order</h2>
      <p>
        If a paid order can&apos;t be fulfilled, for example because an item went out of stock, we will cancel it and refund the amount to your
        original payment method through Razorpay. Refunds usually reach your account in 5–7 working days, depending on your bank.
      </p>
      <h2>Problems with an order</h2>
      <p>If something about your order isn&apos;t right, contact us on WhatsApp with your order number and we&apos;ll look into it.</p>
    </ContentPage>
  );
}
