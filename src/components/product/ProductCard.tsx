"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { discountPercent } from "@/lib/money";
import { Price } from "@/components/ui/Price";
import { AddToCart } from "./AddToCart";
import { WishlistHeart } from "./WishlistHeart";
import type { ProductCardData } from "@/types/catalogue";
import styles from "./ProductCard.module.css";

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const off = discountPercent(product.mrp, product.salePrice);

  return (
    <article className={styles.card} data-color={product.color}>
      <div className={styles.media} ref={mediaRef}>
        <Image src={product.image} alt={product.imageAlt} fill sizes="(min-width: 1200px) 280px, (min-width: 900px) 30vw, 48vw" priority={priority} />
        {off >= 10 && <span className={styles.ribbon}>-{off}%</span>}
        {product.isNew && <span className={styles.newTag}>New</span>}
      </div>
      <WishlistHeart productId={product.id} productName={product.name} className={styles.heart} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{product.brand}</span>
          {product.ageLabel && <span className={styles.age}>{product.ageLabel}</span>}
        </div>
        <Link href={`/product/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>
        <div className={styles.foot}>
          <Price mrp={product.mrp} sale={product.salePrice} />
          <AddToCart productId={product.id} productName={product.name} inStock={product.inStock} imageRef={mediaRef} />
        </div>
      </div>
    </article>
  );
}
