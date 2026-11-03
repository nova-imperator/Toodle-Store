"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { ProductCardData } from "@/types/catalogue";
import styles from "./ProductCarousel.module.css";

export function ProductCarousel({ products, label }: { products: ProductCardData[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => scroll(-1)} aria-label={`Scroll ${label} left`}>
        <Icon name="left" />
      </button>
      <ul ref={track} className={styles.track} aria-label={label}>
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => scroll(1)} aria-label={`Scroll ${label} right`}>
        <Icon name="right" />
      </button>
    </div>
  );
}
