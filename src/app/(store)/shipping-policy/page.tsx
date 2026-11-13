import type { Metadata } from "next";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import { FREE_SHIPPING_FROM, MIN_ORDER, SHIPPING_FEE } from "@/config/shipping";
import { formatPaise } from "@/lib/money";

export const metadata: Metadata = { title: "Shipping Policy", alternates: { canonical: "/shipping-policy" } };

export default function ShippingPolicyPage() {
  return (
    <ContentPage title="Shipping policy" path="/shipping-policy" updated="13 November 2026">
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
      <p>All orders are paid in full online through Razorpay (UPI, cards, netbanking or wallets). We don&apos;t offer cash on delivery.</p>
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
