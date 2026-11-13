import type { BrickColor } from "@/config/catalogue";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: BrickColor;
  qty: number;
  unitPrice: number;
  mrp: number;
  stockQty: number;
  lineTotal: number;
}

export interface CartTotals {
  count: number;
  mrpTotal: number;
  subtotal: number;
  discount: number;
  shipping: number;
  gstIncluded: number;
  total: number;
  /** How much more (paise) the shopper needs to add for free delivery; 0 when already free. */
  toFreeShipping: number;
  /** How much more (paise) is needed to reach the minimum order; 0 when checkout is allowed. */
  belowMinimumBy: number;
}

export interface CartView {
  lines: CartLine[];
  couponCode: string | null;
  couponMessage: string | null;
  totals: CartTotals;
}
