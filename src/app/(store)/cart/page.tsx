import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "../listing.module.css";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className={`container ${styles.pageHead}`}>
      <SectionHeading as="h1" title="Your cart" />
      <CartPageView />
    </div>
  );
}
