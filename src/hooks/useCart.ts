"use client";

import { useContext } from "react";
import { CartContext } from "@/components/cart/CartProvider";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function useCartQty(productId: string) {
  const { cart } = useCart();
  return cart?.lines.find((l) => l.productId === productId)?.qty ?? 0;
}
