import { formatPaise } from "@/lib/money";
import { FREE_SHIPPING_FROM } from "@/config/shipping";
import type { CartTotals } from "@/types/cart";
import styles from "./FreeDeliveryProgress.module.css";

/**
 * Gentle free-delivery nudge (owner, 24 Nov 2026): "Add ₹200 more to get FREE delivery" with a progress bar,
 * or a small celebration once the cart qualifies.
 */
export function FreeDeliveryProgress({ totals }: { totals: CartTotals }) {
  if (totals.count === 0 || totals.belowMinimumBy > 0) return null;
  const itemsTotal = totals.subtotal - totals.discount;

  if (totals.toFreeShipping <= 0) {
    if (totals.shipping > 0) return null;
    return (
      <p className={styles.box} data-done="true" role="status">
        Yay! Your order gets <strong>FREE delivery</strong> 🎉
      </p>
    );
  }

  const pct = Math.min(100, Math.round((itemsTotal / FREE_SHIPPING_FROM) * 100));
  return (
    <div className={styles.box} role="status">
      <p>
        Add <strong>{formatPaise(totals.toFreeShipping)}</strong> more to get <strong>FREE delivery</strong> 🚚
      </p>
      <div className={styles.track} aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
