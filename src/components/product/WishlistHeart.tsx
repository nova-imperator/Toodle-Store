"use client";

import { Icon } from "@/components/ui/Icon";
import { useWishlist } from "@/hooks/useWishlist";
import styles from "./WishlistHeart.module.css";

export function WishlistHeart({ productId, productName, className }: { productId: string; productName: string; className?: string }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.has(productId);
  return (
    <button
      type="button"
      className={`${styles.heart} ${saved ? styles.saved : ""} ${className ?? ""}`}
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
    >
      <Icon name="heart" size={20} filled={saved} />
    </button>
  );
}
