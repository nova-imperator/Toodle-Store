import { discountPercent, formatPaise } from "@/lib/money";
import styles from "./Price.module.css";

export function Price({ mrp, sale, size = "md" }: { mrp: number; sale: number; size?: "md" | "lg" }) {
  const off = discountPercent(mrp, sale);
  return (
    <div className={`${styles.price} ${size === "lg" ? styles.lg : ""}`}>
      <span className={styles.sale}>{formatPaise(sale)}</span>
      {off > 0 && (
        <>
          <span className={styles.mrp}>
            <span className="visually-hidden">MRP </span>
            {formatPaise(mrp)}
          </span>
          <span className={styles.off}>{off}% off</span>
        </>
      )}
    </div>
  );
}
