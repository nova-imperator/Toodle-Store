// Delivery charges and order limits (owner decision, 13 Nov 2026). Amounts in paise.
// No imports: used by both server services and client components.

export const SHIPPING_FEE = 100_00;
/** Orders whose item total (after coupon) reaches this get free delivery. */
export const FREE_SHIPPING_FROM = 999_00; // owner, 24 Nov 2026 (was ₹2,000)
/** Smallest item total (after coupon) that can be checked out. */
export const MIN_ORDER = 50_00;

/**
 * Cash on delivery charge (owner, 14 Nov 2026). Paid online up front to confirm a COD order;
 * the rest of the order is paid in cash to the courier.
 */
export const COD_FEE = 50_00;

export const FREE_SHIPPING_LABEL = "Free delivery on orders of ₹999+";

/** Shown on the home page and at checkout (owner request, 13 Nov 2026). */
export const DELIVERY_REGION_NOTE = {
  title: "We deliver only within India",
  text: "Orders can be shipped to Indian addresses (with a valid 6-digit pincode) only. We don't ship outside India yet.",
};

export function shippingFor(itemsTotal: number): number {
  return itemsTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}
