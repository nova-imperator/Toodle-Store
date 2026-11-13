import { formatPaise } from "@/lib/money";
import { MIN_ORDER } from "@/config/shipping";
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
      <div className={totals.shipping ? undefined : styles.good}>
        <dt>Delivery</dt>
        <dd>{totals.shipping ? formatPaise(totals.shipping) : "Free"}</dd>
      </div>
      {/* Owner: prices don't include GST, so no GST amount is shown. */}
      <div className={styles.muted}>
        <dt>GST</dt>
        <dd>–</dd>
      </div>
      <div className={styles.total}>
        <dt>Total</dt>
        <dd>{formatPaise(totals.total)}</dd>
      </div>
      {totals.belowMinimumBy > 0 ? (
        <p className={styles.warn}>
          Minimum order is {formatPaise(MIN_ORDER)}. Add {formatPaise(totals.belowMinimumBy)} more to check out.
        </p>
      ) : (
        totals.toFreeShipping > 0 && <p className={styles.nudge}>Add {formatPaise(totals.toFreeShipping)} more for free delivery</p>
      )}
      {savings > 0 && <p className={styles.save}>You save {formatPaise(savings)} on this order</p>}
    </dl>
  );
}
