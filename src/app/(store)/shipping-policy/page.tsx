import type { Metadata } from "next";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Shipping Policy", alternates: { canonical: "/shipping-policy" } };

export default function ShippingPolicyPage() {
  return (
    <ContentPage title="Shipping policy" path="/shipping-policy" updated="2 November 2026">
      <h2>Free delivery</h2>
      <p>Delivery is free on every order, with no minimum order value, to any serviceable pincode in India.</p>
      <h2>Delivery time</h2>
      <p>
        Most orders are delivered in {SITE.deliveryDays.min}–{SITE.deliveryDays.max} working days after the order is confirmed. You can check an estimate for
        your pincode on any product page and at checkout. Remote areas can take a little longer.
      </p>
      <h2>Cash on delivery</h2>
      <p>
        Cash on delivery orders are confirmed by our team over a phone call before they are packed. Delivery time starts from that confirmation.
      </p>
      <h2>Tracking</h2>
      <p>When your order ships we email you the courier name and tracking link. You can also see the status in My orders.</p>
      <h2>Questions</h2>
      <p>WhatsApp us on {SITE.phone} and we&apos;ll help.</p>
    </ContentPage>
  );
}
