"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatPaise } from "@/lib/money";
import { useCart } from "@/hooks/useCart";
import type { CartLine } from "@/types/cart";
import styles from "./CartLines.module.css";

export function CartLines({ lines, onNavigate }: { lines: CartLine[]; onNavigate?: () => void }) {
  const { setQty, busyIds } = useCart();

  return (
    <ul className={styles.list}>
      {lines.map((l) => {
        const busy = busyIds.has(l.productId);
        return (
          <li key={l.productId} className={styles.line} data-color={l.color} aria-busy={busy}>
            <Link href={`/product/${l.slug}`} className={styles.thumb} onClick={onNavigate}>
              <Image src={l.image} alt="" width={84} height={84} />
            </Link>
            <div className={styles.info}>
              <Link href={`/product/${l.slug}`} className={styles.name} onClick={onNavigate}>
                {l.name}
              </Link>
              <div className={styles.prices}>
                <strong>{formatPaise(l.lineTotal)}</strong>
                {l.mrp > l.unitPrice && <s>{formatPaise(l.mrp * l.qty)}</s>}
              </div>
              {l.qty > l.stockQty && <p className={styles.warn}>Only {l.stockQty} left. Please reduce the quantity.</p>}
              <div className={styles.controls}>
                <div className={styles.stepper}>
                  <button type="button" onClick={() => setQty(l.productId, l.qty - 1)} disabled={busy} aria-label={`Remove one ${l.name}`}>
                    <Icon name="minus" size={16} />
                  </button>
                  <span aria-live="polite">{l.qty}</span>
                  <button type="button" onClick={() => setQty(l.productId, l.qty + 1)} disabled={busy || l.qty >= Math.min(10, l.stockQty)} aria-label={`Add one more ${l.name}`}>
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <button type="button" className={styles.remove} onClick={() => setQty(l.productId, 0)} disabled={busy}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
