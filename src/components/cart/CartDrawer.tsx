"use client";

import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import { StudLoader } from "@/components/ui/StudLoader";
import { useCart } from "@/hooks/useCart";
import { CartLines } from "./CartLines";
import { CartSummary } from "./CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { cart, ready, drawerOpen, closeDrawer } = useCart();
  const empty = !cart || cart.lines.length === 0;

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={empty ? "Your cart" : `Your cart (${cart.totals.count})`}
      footer={
        !empty && (
          <div className={styles.foot}>
            <CartSummary totals={cart.totals} couponCode={cart.couponCode} />
            <ButtonLink href="/checkout" size="lg" block onClick={closeDrawer}>
              Checkout
            </ButtonLink>
            <ButtonLink href="/cart" variant="ghost" block onClick={closeDrawer}>
              View cart and apply coupon
            </ButtonLink>
          </div>
        )
      }
    >
      {!ready ? (
        <StudLoader center label="Loading your cart" />
      ) : empty ? (
        <EmptyState
          title="Your cart is empty"
          text="Let's find a toy they'll love. Start with our best sellers."
          action={
            <ButtonLink href="/shop?flag=best" onClick={closeDrawer}>
              Shop best sellers
            </ButtonLink>
          }
        />
      ) : (
        <CartLines lines={cart.lines} onNavigate={closeDrawer} />
      )}
    </Drawer>
  );
}
