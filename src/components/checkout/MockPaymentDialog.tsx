"use client";

import { Button } from "@/components/ui/Button";
import { formatPaise } from "@/lib/money";
import styles from "./MockPaymentDialog.module.css";

/** Development stand-in for Razorpay Checkout (shown only when no Razorpay keys are set). */
export function MockPaymentDialog({ amount, onResult }: { amount: number; onResult: (r: "success" | "failure" | "dismiss") => void }) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="mock-title">
        <p className={styles.tag}>Test mode</p>
        <h2 id="mock-title">Simulated payment</h2>
        <p>
          Razorpay keys are not configured, so no real money moves. Choose how this {formatPaise(amount)} payment should end.
        </p>
        <div className={styles.actions}>
          <Button variant="green" block onClick={() => onResult("success")}>
            Payment succeeds
          </Button>
          <Button variant="red" block onClick={() => onResult("failure")}>
            Payment fails
          </Button>
          <Button variant="ghost" block onClick={() => onResult("dismiss")}>
            Close window
          </Button>
        </div>
      </div>
    </div>
  );
}
