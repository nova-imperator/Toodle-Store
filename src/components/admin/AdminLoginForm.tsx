"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import styles from "@/app/admin/admin.module.css";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, { error: null });
  return (
    <form action={action} className={styles.form}>
      <TextField label="Email" name="email" type="email" autoComplete="username" required />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required />
      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="ink" block disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
