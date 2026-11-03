"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { GoogleButton } from "./GoogleButton";
import styles from "./LoginForm.module.css";

const RESEND_SECONDS = 30;

export function LoginForm({ next }: { next: string }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);
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
      await api("/api/auth/otp/verify", { body: { email, code: value } });
      done();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className={styles.card}>
      {step === "email" ? (
        <form
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
            {busy ? "Sending code…" : "Send me a login code"}
          </Button>
          <p className={styles.small}>No password needed. New here? This creates your account.</p>
        </form>
      ) : (
        <form
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
            maxLength={6}
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

      {step === "email" && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <div className={styles.google}>
          <span className={styles.or}>or</span>
          <GoogleButton onSuccess={done} onError={setError} />
        </div>
      )}
    </div>
  );
}
