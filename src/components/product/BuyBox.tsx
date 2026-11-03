"use client";

import { useRef } from "react";
import { Gallery } from "./Gallery";
import { AddToCart } from "./AddToCart";
import { WishlistHeart } from "./WishlistHeart";
import { formatPaise } from "@/lib/money";
import styles from "./BuyBox.module.css";

interface Props {
  productId: string;
  name: string;
  salePrice: number;
  inStock: boolean;
  images: { url: string; altText: string }[];
  /** Server-rendered product details placed between the gallery and the buttons. */
  children: React.ReactNode;
}

/** Gallery + purchase controls share one image ref so Add to cart can animate from the photo. */
export function BuyBox({ productId, name, salePrice, inStock, images, children }: Props) {
  const mediaRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.layout}>
      <Gallery images={images} mediaRef={mediaRef} />
      <div className={styles.info}>
        {children}
        <div className={styles.actions}>
          <AddToCart productId={productId} productName={name} inStock={inStock} size="lg" imageRef={mediaRef} />
          <WishlistHeart productId={productId} productName={name} className={styles.heart} />
        </div>
      </div>

      <div className={styles.sticky}>
        <span className={styles.stickyPrice}>{formatPaise(salePrice)}</span>
        <div className={styles.stickyBtn}>
          <AddToCart productId={productId} productName={name} inStock={inStock} imageRef={mediaRef} />
        </div>
      </div>
    </div>
  );
}
