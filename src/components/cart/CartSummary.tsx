import { formatPaise } from "@/lib/money";
import { MIN_ORDER } from "@/config/shipping";
import type { CartTotals } from "@/types/cart";
import { FreeDeliveryProgress } from "./FreeDeliveryProgress";
import styles from "./CartSummary.module.css";

/** `codFee`: cash on delivery charge, shown at checkout when COD is chosen. */
export function CartSummary({ totals, couponCode, codFee = 0 }: { totals: CartTotals; couponCode: string | null; codFee?: number }) {
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
      {codFee > 0 && (
        <div>
          <dt>Cash on delivery charge</dt>
          <dd>{formatPaise(codFee)}</dd>
        </div>
      )}
      {/* Owner: prices don't include GST, so no GST amount is shown. */}
      <div className={styles.muted}>
        <dt>GST</dt>
        <dd>–</dd>
      </div>
      <div className={styles.total}>
        <dt>Total</dt>
        <dd>{formatPaise(totals.total + codFee)}</dd>
      </div>
      {totals.belowMinimumBy > 0 ? (
        <p className={styles.warn}>
          Minimum order is {formatPaise(MIN_ORDER)}. Add {formatPaise(totals.belowMinimumBy)} more to check out.
        </p>
      ) : (
        <FreeDeliveryProgress totals={totals} />
      )}
      {savings > 0 && <p className={styles.save}>You save {formatPaise(savings)} on this order</p>}
    </dl>
  );
}
