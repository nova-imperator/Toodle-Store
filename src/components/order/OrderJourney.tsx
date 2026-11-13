import type { OrderStatus } from "@prisma/client";
import { Icon } from "@/components/ui/Icon";
import styles from "./OrderJourney.module.css";

export interface JourneySteps {
  placed: string | null;
  packed: string | null;
  shipped: string | null;
  delivered: string | null;
  cancelled: string | null;
}

const ORDER: { key: keyof Omit<JourneySteps, "cancelled">; status: OrderStatus; label: string; waiting: string }[] = [
  { key: "placed", status: "placed", label: "Order confirmed", waiting: "Waiting for payment" },
  { key: "packed", status: "packed", label: "Packed", waiting: "We'll pack it soon" },
  { key: "shipped", status: "shipped", label: "Shipped", waiting: "Not shipped yet" },
  { key: "delivered", status: "delivered", label: "Delivered", waiting: "On the way to you" },
];

const RANK: Partial<Record<OrderStatus, number>> = { placed: 0, packed: 1, shipped: 2, delivered: 3 };

const when = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

/** Vertical order journey with the date and time each step happened. */
export function OrderJourney({ status, steps, shippedNote }: { status: OrderStatus; steps: JourneySteps; shippedNote?: React.ReactNode }) {
  const reached = RANK[status] ?? -1;

  return (
    <ol className={styles.journey}>
      {ORDER.map((s, i) => {
        // Orders that moved on before step dates were recorded still show as done, just without a time;
        // cancelled orders keep the steps they reached.
        const time = steps[s.key];
        const done = i <= reached || Boolean(time);
        return (
          <li key={s.key} className={done ? styles.done : undefined} aria-current={i === reached ? "step" : undefined}>
            <span className={styles.dot} aria-hidden="true">
              {done && <Icon name="check" size={16} />}
            </span>
            <div>
              <strong>{s.label}</strong>
              <small>{done ? (time ? when.format(new Date(time)) : "Done") : s.waiting}</small>
              {s.key === "shipped" && done && shippedNote}
            </div>
          </li>
        );
      })}
      {status === "cancelled" && (
        <li className={styles.cancelled} aria-current="step">
          <span className={styles.dot} aria-hidden="true">
            <Icon name="close" size={16} />
          </span>
          <div>
            <strong>Cancelled</strong>
            <small>{steps.cancelled ? when.format(new Date(steps.cancelled)) : "This order was cancelled"}</small>
          </div>
        </li>
      )}
    </ol>
  );
}
