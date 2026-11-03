"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import styles from "./HeaderActions.module.css";

export function HeaderActions({ userName }: { userName: string | null }) {
  const { cart, openDrawer, bump } = useCart();
  const { ids } = useWishlist();
  const count = cart?.totals.count ?? 0;

  return (
    <div className={styles.actions}>
      <Link href="/b2b" className={styles.b2b}>
        <Icon name="box" size={18} />
        <span>
          Bulk <span className={styles.wide}>/ B2B</span>
        </span>
      </Link>
      <Link href="/account/wishlist" className={`${styles.icon} ${styles.hideSm}`} aria-label={`Wishlist, ${ids.size} saved`}>
        <Icon name="heart" />
        {ids.size > 0 && <span className={styles.dot}>{ids.size}</span>}
      </Link>
      <Link href={userName ? "/account" : "/login"} className={`${styles.icon} ${styles.hideSm}`} aria-label={userName ? `My account (${userName})` : "Log in"}>
        <Icon name="user" />
      </Link>
      <button type="button" className={styles.cart} onClick={openDrawer} aria-label={`Cart, ${count} items`} data-cart-target>
        <Icon name="cart" />
        {count > 0 && (
          <span key={bump} className={styles.badge}>
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
