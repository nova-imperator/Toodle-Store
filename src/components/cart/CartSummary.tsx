import { formatPaise } from "@/lib/money";
import type { CartTotals } from "@/types/cart";
import styles from "./CartSummary.module.css";

export function CartSummary({ totals, couponCode }: { totals: CartTotals; couponCode: string | null }) {
  const savings = totals.mrpTotal - totals.subtotal + totals.discount;
  return (
    <dl className={styles.summary}>
      <div>
        <dt>Items ({totals.count})</dt>
        <dd>{formatPaise(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className={styles.good}>
          <dt>Coupon {couponCode}</dt>
          <dd>−{formatPaise(totals.discount)}</dd>
        </div>
      )}
      <div className={styles.good}>
        <dt>Delivery</dt>
        <dd>Free</dd>
      </div>
      <div className={styles.muted}>
        <dt>GST included</dt>
        <dd>{formatPaise(totals.gstIncluded)}</dd>
      </div>
      <div className={styles.total}>
        <dt>Total</dt>
        <dd>{formatPaise(totals.total)}</dd>
      </div>
      {savings > 0 && <p className={styles.save}>You save {formatPaise(savings)} on this order</p>}
    </dl>
  );
}
