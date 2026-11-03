"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/hooks/useCart";
import styles from "./CartToast.module.css";

/** Shows cart errors (out of stock, limits) and clears them after a few seconds. */
export function CartToast() {
  const { error, clearError } = useCart();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 4500);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <div className={styles.region} role="status" aria-live="assertive">
      {error && (
        <div className={styles.toast}>
          <Icon name="alert" size={20} />
          <span>{error}</span>
          <button type="button" onClick={clearError} aria-label="Dismiss">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
