import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import { COD_FEE, FREE_SHIPPING_FROM, MIN_ORDER, SHIPPING_FEE } from "@/config/shipping";
import { formatPaise } from "@/lib/money";

export const metadata: Metadata = pageSeo({
  title: "Shipping Policy",
  description: "Delivery across India for ₹100, free on orders of ₹2,000 or more. Delivery times, cash on delivery and order tracking.",
  path: "/shipping-policy"
});

export default function ShippingPolicyPage() {
  return (
    <ContentPage title="Shipping policy" path="/shipping-policy" updated="14 November 2026">
      <h2>Where we deliver</h2>
      <p>We deliver only within India, to addresses with a valid 6-digit Indian pincode. We don&apos;t ship to other countries.</p>
      <h2>Delivery charges</h2>
      <p>
        Delivery is {formatPaise(SHIPPING_FEE)} per order, to any serviceable pincode in India. Orders of {formatPaise(FREE_SHIPPING_FROM)} or more (after any
        coupon) are delivered free. The delivery charge is shown in your cart and at checkout before you pay.
      </p>
      <h2>Minimum order</h2>
      <p>The minimum order value is {formatPaise(MIN_ORDER)}.</p>
      <h2>Payment</h2>
      <p>You can pay in full online through Razorpay (UPI, cards, netbanking or wallets), or choose cash on delivery.</p>
      <p>
        Cash on delivery has an extra charge of {formatPaise(COD_FEE)}. You pay this charge online at checkout to confirm the order, and pay the rest of the
        order in cash when it is delivered.
      </p>
      <h2>Delivery time</h2>
      <p>
        Most orders are delivered in {SITE.deliveryDays.min}–{SITE.deliveryDays.max} working days after payment. You can check an estimate for your pincode on
        any product page and at checkout. Remote areas can take a little longer.
      </p>
      <h2>Tracking</h2>
      <p>When your order ships we email you the courier name and tracking link. You can also see the status in My orders.</p>
      <h2>Questions</h2>
      <p>WhatsApp us on {SITE.phone} and we&apos;ll help.</p>
    </ContentPage>
  );
}
