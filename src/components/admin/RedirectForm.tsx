"use client";

import { useActionState } from "react";
import { addRedirectAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import styles from "@/app/admin/admin.module.css";

export function RedirectForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(addRedirectAction, { error: null });
  return (
    <form action={action} className={styles.form} key={state.ok}>
      <TextField label="Old URL" name="oldUrl" placeholder="/product-category/rc-cars/" required />
      <TextField label="New URL" name="newUrl" placeholder="/category/remote-control-toys" required />
      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      {state.ok && <p className={styles.success} role="status">{state.ok}</p>}
      <Button type="submit" variant="ink" disabled={pending}>
        {pending ? "Saving…" : "Add redirect"}
      </Button>
    </form>
  );
}
