import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getAddresses } from "@/server/services/order";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "../listing.module.css";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const [address] = await getAddresses(user.id);

  return (
    <div className={`container ${styles.pageHead}`}>
      <SectionHeading as="h1" title="Checkout" subtitle="One page, three quick steps. Delivery is free." />
      <CheckoutForm
        email={user.email}
        phone={user.phone}
        address={
          address
            ? { name: address.name, phone: address.phone, pincode: address.pincode, city: address.city, state: address.state, line1: address.line1, line2: address.line2 ?? "", landmark: address.landmark ?? "" }
            : null
        }
      />
    </div>
  );
}
