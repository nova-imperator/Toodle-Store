"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import styles from "./Gallery.module.css";

interface Props {
  images: { url: string; altText: string }[];
  mediaRef: RefObject<HTMLDivElement | null>;
}

export function Gallery({ images, mediaRef }: Props) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const go = (i: number) => setActive((i + images.length) % images.length);

  return (
    <div className={styles.gallery}>
      <div
        ref={mediaRef}
        className={styles.main}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <Image key={images[active].url} src={images[active].url} alt={images[active].altText} fill sizes="(min-width: 900px) 560px, 100vw" priority className={styles.img} />
        <span className={styles.counter}>
          {active + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 && (
        <ul className={styles.thumbs}>
          {images.map((img, i) => (
            <li key={img.url}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={i === active}>
                <Image src={img.url} alt="" width={88} height={88} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
