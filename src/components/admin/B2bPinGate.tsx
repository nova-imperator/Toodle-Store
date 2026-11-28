"use client";

import { useActionState } from "react";
import { unlockB2bAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import styles from "@/app/admin/admin.module.css";

/** Asks for the B2B panel PIN before showing wholesale enquiries. */
export function B2bPinGate({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(unlockB2bAction.bind(null, next), { error: null });
  return (
    <div className={styles.pinWrap}>
      <form action={action} className={styles.pinCard}>
        <h1>B2B enquiries</h1>
        <p className={styles.sub}>Enter the B2B panel PIN to continue.</p>
        <input
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={12}
          autoFocus
          aria-label="PIN"
          className={styles.pinInput}
          aria-invalid={!!state.error}
        />
        {state.error && (
          <p className={styles.error} role="alert">
            {state.error}
          </p>
        )}
        <Button type="submit" variant="ink" block disabled={pending}>
          {pending ? "Checking…" : "Open B2B enquiries"}
        </Button>
      </form>
    </div>
  );
}
