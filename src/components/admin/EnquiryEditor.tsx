"use client";

import { useActionState } from "react";
import type { EnquiryStatus } from "@prisma/client";
import { updateEnquiryAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { ENQUIRY_STATUS_LABEL } from "@/config/orders";
import styles from "@/app/admin/admin.module.css";

interface Props {
  id: string;
  status: EnquiryStatus;
  assignedTo: string | null;
  notes: string | null;
  assignees: { id: string; name: string }[];
}

export function EnquiryEditor({ id, status, assignedTo, notes, assignees }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateEnquiryAction.bind(null, id), { error: null });
  return (
    <form action={action} className={styles.form}>
      <SelectField label="Status" name="status" defaultValue={status}>
        {Object.entries(ENQUIRY_STATUS_LABEL).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </SelectField>
      <SelectField label="Assigned to" name="assignedTo" defaultValue={assignedTo ?? ""}>
        <option value="">Nobody yet</option>
        {assignees.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </SelectField>
      <TextAreaField label="Notes" name="notes" defaultValue={notes ?? ""} placeholder="Call notes, quote sent, follow-up date…" />
      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      {state.ok && <p className={styles.success} role="status">{state.ok}</p>}
      <Button type="submit" variant="ink" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
