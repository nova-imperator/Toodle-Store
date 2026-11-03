"use client";

import { useContext } from "react";
import { WishlistContext } from "@/components/cart/WishlistProvider";

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
