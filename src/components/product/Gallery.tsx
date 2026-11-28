"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import type { ProductVideo } from "@/lib/video";
import styles from "./Gallery.module.css";

interface Props {
  images: { url: string; altText: string }[];
  /** Optional product video, shown as the last slide. */
  video?: ProductVideo | null;
  soldOut?: boolean;
  mediaRef: RefObject<HTMLDivElement | null>;
}

/** Product photos (fitted, never cropped) + optional video slide, with swipe on phones. */
export function Gallery({ images, video = null, soldOut = false, mediaRef }: Props) {
  const slides = images.length + (video ? 1 : 0);
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);
  const go = (i: number) => setActive((i + slides) % slides);
  const onVideo = !!video && active === images.length;

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
        {onVideo && video ? (
          video.kind === "youtube" ? (
            <iframe
              className={styles.video}
              src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`}
              title="Product video"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className={styles.video} src={video.src} controls playsInline preload="metadata" />
          )
        ) : (
          <Image key={images[active]?.url} src={images[active]?.url ?? "/images/brand/logo.webp"} alt={images[active]?.altText ?? ""} fill sizes="(min-width: 900px) 560px, 100vw" priority className={styles.img} />
        )}
        {soldOut && !onVideo && <span className={styles.soldOut}>Sold out for now</span>}
        {slides > 1 && (
          <span className={styles.counter}>
            {active + 1} / {slides}
          </span>
        )}
      </div>
      {slides > 1 && (
        <ul className={styles.thumbs}>
          {images.map((img, i) => (
            <li key={img.url}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} aria-current={i === active}>
                <Image src={img.url} alt="" width={88} height={88} />
              </button>
            </li>
          ))}
          {video && (
            <li>
              <button type="button" onClick={() => setActive(images.length)} aria-label="Play product video" aria-current={onVideo} className={styles.videoThumb}>
                {images[0] && <Image src={images[0].url} alt="" width={88} height={88} />}
                <span aria-hidden="true">▶</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
