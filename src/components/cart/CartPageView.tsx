"use client";

import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudLoader } from "@/components/ui/StudLoader";
import { useCart } from "@/hooks/useCart";
import { CartLines } from "./CartLines";
import { CartSummary } from "./CartSummary";
import { CouponForm } from "./CouponForm";
import styles from "./CartPageView.module.css";

export function CartPageView() {
  const { cart, ready } = useCart();

  if (!ready) return <StudLoader center label="Loading your cart" />;

  if (!cart || cart.lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        text="Pick a category or an age and we'll help you find something special."
        action={<ButtonLink href="/shop">Start shopping</ButtonLink>}
      />
    );
  }

  const blocked = cart.lines.some((l) => l.qty > l.stockQty);

  return (
    <div className={styles.layout}>
      <div className={styles.lines}>
        <CartLines lines={cart.lines} />
      </div>
      <aside className={styles.side}>
        <CouponForm />
        <CartSummary totals={cart.totals} couponCode={cart.totals.discount > 0 ? cart.couponCode : null} />
        {blocked ? (
          <p className={styles.warn}>Some items have less stock than you asked for. Please update them to continue.</p>
        ) : (
          <ButtonLink href="/checkout" size="lg" block>
            Checkout securely
          </ButtonLink>
        )}
        <p className={styles.note}>Pay by UPI, card or netbanking. Cash on delivery available.</p>
      </aside>
    </div>
  );
}
