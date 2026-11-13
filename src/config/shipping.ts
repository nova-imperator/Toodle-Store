// Delivery charges and order limits (owner decision, 13 Nov 2026). Amounts in paise.
// No imports: used by both server services and client components.

export const SHIPPING_FEE = 100_00;
/** Orders whose item total (after coupon) reaches this get free delivery. */
export const FREE_SHIPPING_FROM = 2_000_00;
/** Smallest item total (after coupon) that can be checked out. */
export const MIN_ORDER = 50_00;

export const FREE_SHIPPING_LABEL = "Free delivery on orders of ₹2,000+";

export function shippingFor(itemsTotal: number): number {
  return itemsTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}
