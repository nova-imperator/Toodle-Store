"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { flyToCart } from "@/lib/flyToCart";
import type { CartView } from "@/types/cart";

export interface CartContextValue {
  cart: CartView | null;
  ready: boolean;
  busyIds: Set<string>;
  drawerOpen: boolean;
  bump: number;
  error: string | null;
  add: (productId: string, source?: HTMLElement | null) => Promise<boolean>;
  setQty: (productId: string, qty: number) => Promise<void>;
  applyCoupon: (code: string | null) => Promise<string | null>;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartView | null>(null);
  const [ready, setReady] = useState(false);
  const [busyIds, setBusy] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setCart(await api<CartView>("/api/cart"));
    } catch {
      setCart(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const withBusy = useCallback(async <T,>(id: string, fn: () => Promise<T>) => {
    setBusy((s) => new Set(s).add(id));
    try {
      return await fn();
    } finally {
      setBusy((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  }, []);

  const add = useCallback(
    (productId: string, source?: HTMLElement | null) =>
      withBusy(productId, async () => {
        try {
          const next = await api<CartView>("/api/cart/items", { body: { productId, qty: 1 } });
          setCart(next);
          flyToCart(source ?? null);
          setBump((b) => b + 1);
          return true;
        } catch (e) {
          setError((e as Error).message);
          return false;
        }
      }),
    [withBusy],
  );

  const setQty = useCallback(
    (productId: string, qty: number) =>
      withBusy(productId, async () => {
        try {
          setCart(await api<CartView>("/api/cart/items", { method: "PATCH", body: { productId, qty } }));
        } catch (e) {
          setError((e as Error).message);
        }
      }),
    [withBusy],
  );

  const applyCoupon = useCallback(async (code: string | null) => {
    try {
      setCart(await api<CartView>("/api/cart/coupon", { body: { code } }));
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart, ready, busyIds, drawerOpen, bump, error, add, setQty, applyCoupon, refresh,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      clearError: () => setError(null),
    }),
    [cart, ready, busyIds, drawerOpen, bump, error, add, setQty, applyCoupon, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
