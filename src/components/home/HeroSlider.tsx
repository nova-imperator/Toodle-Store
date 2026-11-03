"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import styles from "./HeroSlider.module.css";

export interface Slide {
  id: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  theme: string;
}

const INTERVAL = 6000;
const CTA_VARIANT: Record<string, "red" | "blue" | "yellow"> = { red: "red", blue: "blue", orange: "red", ink: "yellow" };

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, count, go]);

  if (count === 0) return null;

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.slide} ${i === index ? styles.active : ""}`}
          data-theme={s.theme}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          aria-hidden={i !== index}
          inert={i !== index}
        >
          <div className={`container ${styles.inner}`}>
            <div className={styles.copy}>
              {s.eyebrow && <p className={styles.eyebrow}>{s.eyebrow}</p>}
              <h2 className={styles.title}>{s.title}</h2>
              {s.subtitle && <p className={styles.sub}>{s.subtitle}</p>}
              <ButtonLink href={s.ctaHref} variant={CTA_VARIANT[s.theme] ?? "red"} size="lg">
                {s.ctaLabel}
              </ButtonLink>
            </div>
            <div className={styles.art}>
              <Image src={s.image} alt="" width={1000} height={760} priority={i === 0} sizes="(min-width: 900px) 560px, 90vw" />
            </div>
          </div>
        </div>
      ))}

      {count > 1 && (
        <div className={`container ${styles.controls}`}>
          <button type="button" className={styles.arrow} onClick={() => go(index - 1)} aria-label="Previous offer">
            <Icon name="left" />
          </button>
          <div className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={styles.dot}
                aria-label={`Show offer ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button type="button" className={styles.arrow} onClick={() => go(index + 1)} aria-label="Next offer">
            <Icon name="right" />
          </button>
        </div>
      )}
    </section>
  );
}
