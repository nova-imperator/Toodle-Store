"use client";

import type { RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCart, useCartQty } from "@/hooks/useCart";
import styles from "./AddToCart.module.css";

interface Props {
  productId: string;
  productName: string;
  inStock: boolean;
  size?: "sm" | "lg";
  /** Element holding the product image, used for the fly-to-cart animation. */
  imageRef?: RefObject<HTMLElement | null>;
}

export function AddToCart({ productId, productName, inStock, size = "sm", imageRef }: Props) {
  const { add, setQty, busyIds } = useCart();
  const qty = useCartQty(productId);
  const busy = busyIds.has(productId);

  if (!inStock) {
    return (
      <Button variant="ghost" size={size} block disabled>
        Sold out
      </Button>
    );
  }

  if (qty === 0) {
    return (
      <Button variant="red" size={size} block disabled={busy} onClick={() => add(productId, imageRef?.current)} aria-label={`Add ${productName} to cart`}>
        <Icon name="cart" size={size === "lg" ? 22 : 18} />
        {size === "lg" ? "Add to cart" : "Add"}
      </Button>
    );
  }

  return (
    <div className={`${styles.stepper} ${size === "lg" ? styles.lg : ""}`} aria-busy={busy}>
      <button type="button" onClick={() => setQty(productId, qty - 1)} disabled={busy} aria-label={`Remove one ${productName}`}>
        <Icon name="minus" size={18} />
      </button>
      <span className={styles.qty} aria-live="polite">
        {qty}
        <span className="visually-hidden"> in cart</span>
      </span>
      <button type="button" onClick={() => add(productId)} disabled={busy || qty >= 10} aria-label={`Add one more ${productName}`}>
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
