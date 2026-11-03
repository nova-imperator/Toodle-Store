"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import styles from "./CouponForm.module.css";

export function CouponForm() {
  const { cart, applyCoupon } = useCart();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const applied = cart?.couponCode;

  const submit = async (value: string | null) => {
    setBusy(true);
    setError(await applyCoupon(value));
    setBusy(false);
    if (value === null) setCode("");
  };

  if (applied) {
    return (
      <div className={styles.applied}>
        <span>
          Coupon <strong>{applied}</strong> {cart.couponMessage ? <em className={styles.err}>{cart.couponMessage}</em> : "applied"}
        </span>
        <button type="button" onClick={() => submit(null)} disabled={busy}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) void submit(code);
      }}
    >
      <label htmlFor="coupon" className="visually-hidden">
        Coupon code
      </label>
      <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" autoComplete="off" aria-invalid={!!error} aria-describedby="coupon-err" />
      <button type="submit" disabled={busy || !code.trim()}>
        Apply
      </button>
      {error && (
        <p id="coupon-err" className={styles.err} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
