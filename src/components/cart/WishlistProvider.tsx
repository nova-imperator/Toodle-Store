"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface WishlistContextValue {
  ids: Set<string>;
  toggle: (productId: string) => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    api<{ ids: string[] }>("/api/wishlist")
      .then((r) => setIds(new Set(r.ids)))
      .catch(() => setIds(new Set()));
  }, []);

  const toggle = useCallback(async (productId: string) => {
    setIds((s) => {
      const n = new Set(s);
      if (n.has(productId)) n.delete(productId);
      else n.add(productId);
      return n;
    });
    try {
      const r = await api<{ ids: string[] }>("/api/wishlist", { body: { productId } });
      setIds(new Set(r.ids));
    } catch {
      const r = await api<{ ids: string[] }>("/api/wishlist").catch(() => ({ ids: [] }));
      setIds(new Set(r.ids));
    }
  }, []);

  const value = useMemo(() => ({ ids, toggle }), [ids, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
