"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { formatPaise } from "@/lib/money";
import { useCart } from "@/hooks/useCart";
import styles from "./MobileCartBar.module.css";

const HIDDEN_ON = ["/cart", "/checkout", "/product/"];

/** Sticky "view cart" bar on phones once the cart has items. */
export function MobileCartBar() {
  const { cart, openDrawer, bump } = useCart();
  const pathname = usePathname();
  const count = cart?.totals.count ?? 0;
  if (count === 0 || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.btn} onClick={openDrawer}>
        <span key={bump} className={styles.count}>
          <Icon name="cart" size={18} /> {count} {count === 1 ? "toy" : "toys"}
        </span>
        <span className={styles.total}>{formatPaise(cart!.totals.total)}</span>
        <span className={styles.cta}>View cart</span>
      </button>
    </div>
  );
}
