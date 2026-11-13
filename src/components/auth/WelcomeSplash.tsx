"use client";

import { useEffect, useRef } from "react";
import type { LoginResult } from "@/types/auth";
import styles from "./WelcomeSplash.module.css";

const SHOW_MS = 1200;

/** Calm "you're in" message shown inside the login card, then hands over to `onDone` (the redirect). */
export function WelcomeSplash({ result, onDone }: { result: LoginResult; onDone: () => void }) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const first = result.name?.trim().split(/\s+/)[0];
  const title = result.isNew ? "Welcome to Toodle Store!" : first ? `Welcome back, ${first}!` : "Welcome back!";

  useEffect(() => {
    const t = window.setTimeout(() => doneRef.current(), SHOW_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={styles.box} role="status" aria-live="polite">
      <span className={styles.tick} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>You&apos;re logged in. Taking you in…</p>
    </div>
  );
}
