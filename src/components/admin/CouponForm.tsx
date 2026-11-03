"use client";

import { useActionState } from "react";
import { createCouponAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import styles from "@/app/admin/admin.module.css";

export function CouponForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createCouponAction, { error: null });
  return (
    <form action={action} className={styles.form} key={state.ok}>
      <TextField label="Code" name="code" placeholder="DIWALI15" required />
      <div className={styles.grid2}>
        <SelectField label="Type" name="type" defaultValue="percent">
          <option value="percent">Percent off</option>
          <option value="flat">Flat ₹ off</option>
        </SelectField>
        <TextField label="Value" name="value" type="number" min={1} required />
        <TextField label="Minimum order (₹)" name="minOrder" type="number" min={0} defaultValue={0} />
        <TextField label="Usage limit" name="usageLimit" type="number" min={1} optional />
      </div>
      <TextField label="Expires on" name="expiresAt" type="date" optional />
      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      {state.ok && <p className={styles.success} role="status">{state.ok}</p>}
      <Button type="submit" variant="ink" disabled={pending}>
        {pending ? "Creating…" : "Create coupon"}
      </Button>
    </form>
  );
}
