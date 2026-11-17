"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { LoginResult } from "@/types/auth";
import { GoogleButton } from "./GoogleButton";
import { WelcomeSplash } from "./WelcomeSplash";
import styles from "./LoginForm.module.css";

const RESEND_SECONDS = 30;
const HAS_GOOGLE = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function LoginForm({ next }: { next: string }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<LoginResult | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  // Full navigation so the server layout picks up the new session, cart and wishlist.
  const done = useCallback(() => window.location.assign(next), [next]);

  const sendCode = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ sent: boolean; demoCode?: string }>("/api/auth/otp/request", { body: { email } });
      setDemoCode(r.demoCode ?? null);
      setStep("code");
      setCode("");
      setWait(RESEND_SECONDS);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (value = code) => {
    setBusy(true);
    setError(null);
    try {
      setWelcome(await api<LoginResult>("/api/auth/otp/verify", { body: { email, code: value } }));
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* Google first: one tap, no code to type. Email code is the fallback. */}
      {!welcome && step === "email" && HAS_GOOGLE && (
        <div className={styles.google}>
          <GoogleButton onSuccess={setWelcome} onError={setError} />
          <span className={styles.or}>or use your email</span>
        </div>
      )}

      {welcome ? (
        <WelcomeSplash result={welcome} onDone={done} />
      ) : step === "email" ? (
        <form
          key="email"
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void sendCode();
          }}
        >
          <label htmlFor="email" className={styles.label}>
            Your email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            aria-invalid={!!error}
            aria-describedby={error ? "login-err" : undefined}
          />
          <Button type="submit" size="lg" block disabled={busy}>
            {busy ? "Sending code…" : "Email me a login code"}
          </Button>
          <p className={styles.small}>No password needed. New here? This creates your account.</p>
        </form>
      ) : (
        <form
          key="code"
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <p>
            We sent a 6-digit code to <strong>{email}</strong>.{" "}
            <button type="button" className={styles.link} onClick={() => setStep("email")}>
              Change
            </button>
          </p>
          {demoCode && (
            <p className={styles.demo}>
              Demo site: email isn&apos;t connected yet, so your code is <strong>{demoCode}</strong>
            </p>
          )}
          <label htmlFor="code" className={styles.label}>
            Login code
          </label>
          <input
            ref={codeRef}
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            // No maxLength: a code copied from the email's digit tiles arrives as "0 3 5 9 3 7",
            // and maxLength would cut it to "0 3 5" before the digits are picked out below.
            value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(v);
              if (v.length === 6 && !busy) void verify(v);
            }}
            className={`${styles.input} ${styles.code}`}
            aria-invalid={!!error}
            aria-describedby={error ? "login-err" : undefined}
          />
          <Button type="submit" size="lg" block disabled={busy || code.length !== 6}>
            {busy ? "Checking…" : "Log in"}
          </Button>
          <p className={styles.small}>
            Didn&apos;t get it? Check spam, or{" "}
            {wait > 0 ? (
              <span>resend in {wait}s</span>
            ) : (
              <button type="button" className={styles.link} onClick={sendCode} disabled={busy}>
                send a new code
              </button>
            )}
            .
          </p>
        </form>
      )}

      {error && (
        <p id="login-err" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
