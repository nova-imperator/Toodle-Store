"use client";

import { useActionState, useState } from "react";
import type { OrderStatus } from "@prisma/client";
import { confirmCodAction, orderStatusAction, refundAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { ORDER_STATUS_LABEL } from "@/config/orders";
import styles from "@/app/admin/admin.module.css";

const INITIAL: ActionState = { error: null };

function Result({ state }: { state: ActionState }) {
  if (state.error) return <p className={styles.error} role="alert">{state.error}</p>;
  if (state.ok) return <p className={styles.success} role="status">{state.ok}</p>;
  return null;
}

export function OrderActions({ orderId, status, next, canRefund }: { orderId: string; status: OrderStatus; next: OrderStatus[]; canRefund: boolean }) {
  const [statusState, statusAction, statusPending] = useActionState(orderStatusAction.bind(null, orderId), INITIAL);
  const [codState, codAction, codPending] = useActionState(confirmCodAction.bind(null, orderId), INITIAL);
  const [refundState, refundFormAction, refundPending] = useActionState(refundAction.bind(null, orderId), INITIAL);
  const [target, setTarget] = useState<OrderStatus | "">(next.find((s) => s !== "cancelled") ?? "");

  return (
    <div className={styles.form}>
      {status === "cod_enquiry" && (
        <form action={codAction} className={styles.form}>
          <p>Call the customer first. Confirming reserves the stock and emails them.</p>
          <Button type="submit" variant="green" disabled={codPending}>
            {codPending ? "Confirming…" : "Confirm COD order"}
          </Button>
          <Result state={codState} />
        </form>
      )}

      {next.length > 0 && (
        <form action={statusAction} className={styles.form}>
          <fieldset className={styles.checks}>
            <legend>Move order to</legend>
            {next.map((s) => (
              <label key={s}>
                <input type="radio" name="status" value={s} checked={target === s} onChange={() => setTarget(s)} /> {ORDER_STATUS_LABEL[s]}
              </label>
            ))}
          </fieldset>
          {target === "shipped" && (
            <div className={styles.grid2}>
              <TextField label="Courier" name="courier" placeholder="e.g. Delhivery" />
              <TextField label="AWB / tracking number" name="awbNumber" />
              <TextField label="Tracking link" name="trackingUrl" type="url" placeholder="https://" className={styles.span2} />
            </div>
          )}
          <Button type="submit" variant={target === "cancelled" ? "red" : "blue"} disabled={statusPending || !target}>
            {statusPending ? "Saving…" : target ? `Mark as ${ORDER_STATUS_LABEL[target as OrderStatus].toLowerCase()}` : "Choose a status"}
          </Button>
          <Result state={statusState} />
        </form>
      )}

      {canRefund && (
        <form
          action={refundFormAction}
          className={styles.inlineForm}
          onSubmit={(e) => {
            if (!confirm("Refund the full amount to the customer through Razorpay? This can't be undone.")) e.preventDefault();
          }}
        >
          <p>Store policy is no refunds. Use only for exceptions, such as an order you can&apos;t fulfil.</p>
          <Button type="submit" variant="ghost" disabled={refundPending}>
            {refundPending ? "Refunding…" : "Issue full refund"}
          </Button>
          <Result state={refundState} />
        </form>
      )}

      {next.length === 0 && status !== "cod_enquiry" && !canRefund && <p className={styles.sub}>No further actions for this order.</p>}
    </div>
  );
}
