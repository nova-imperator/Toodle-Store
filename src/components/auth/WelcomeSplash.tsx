"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import BlurText from "@/components/motion/BlurText";
import type { LoginResult } from "@/types/auth";
import styles from "./WelcomeSplash.module.css";

const CONFETTI_COLORS = ["#E8382D", "#FFC72C", "#1F7FE0", "#3FA34D", "#FF8A1E"];
const SHOW_MS = 2400;
const SHOW_MS_REDUCED = 900;

/** Short celebration after login, then hands over to `onDone` (the redirect). */
export function WelcomeSplash({ result, onDone }: { result: LoginResult; onDone: () => void }) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const first = result.name?.trim().split(/\s+/)[0];
  const title = result.isNew ? "Welcome to Toodle Store!" : first ? `Welcome back, ${first}!` : "Welcome back!";
  const text = result.isNew ? "Your account is ready. Let's find something fun 🎈" : "So happy to see you again. Taking you in…";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => doneRef.current(), reduce ? SHOW_MS_REDUCED : SHOW_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Fixed pseudo-random layout so server and client markup match.
  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${((i * 53) % 60) / 100}s`,
        duration: `${1.6 + ((i * 29) % 10) / 10}s`,
        rotate: `${(i * 47) % 360}deg`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: i % 3 === 0 ? styles.round : undefined,
      })),
    [],
  );

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.confetti} aria-hidden="true">
        {confetti.map((c, i) => (
          <span
            key={i}
            className={c.shape}
            style={{ left: c.left, background: c.color, animationDelay: c.delay, animationDuration: c.duration, rotate: c.rotate }}
          />
        ))}
      </div>
      <div className={styles.card}>
        <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.mascot} priority />
        <BlurText text={title} trigger="load" animateBy="words" direction="bottom" delay={110} className={styles.title} />
        <p className={styles.text}>{text}</p>
        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
