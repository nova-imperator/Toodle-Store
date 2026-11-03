"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import styles from "./DeliveryCheck.module.css";

interface Result {
  city: string;
  state: string;
  estimate: { from: string; to: string };
}

export function DeliveryCheck() {
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setResult(await api<Result>(`/api/pincode/${pin}`));
    } catch (err) {
      setResult(null);
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.box}>
      <form className={styles.form} onSubmit={check}>
        <label htmlFor="pin" className={styles.label}>
          <Icon name="pin" size={18} /> Check delivery
        </label>
        <div className={styles.row}>
          <input
            id="pin"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Your pincode"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!error}
            aria-describedby="pin-msg"
          />
          <button type="submit" disabled={busy}>
            {busy ? "Checking…" : "Check"}
          </button>
        </div>
      </form>
      <p id="pin-msg" className={error ? styles.error : styles.ok} aria-live="polite">
        {error ??
          (result ? (
            <>
              Free delivery to {result.city}, {result.state} by <strong>{result.estimate.from} – {result.estimate.to}</strong>
            </>
          ) : (
            "Free delivery on every order across India."
          ))}
      </p>
    </div>
  );
}
