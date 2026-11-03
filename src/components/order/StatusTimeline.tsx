import type { OrderStatus } from "@prisma/client";
import styles from "./StatusTimeline.module.css";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function StatusTimeline({ status, trackingUrl }: { status: OrderStatus; trackingUrl?: string | null }) {
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <ol className={styles.timeline}>
      {STEPS.map((s, i) => (
        <li key={s.key} className={i <= current ? styles.done : undefined} aria-current={i === current ? "step" : undefined}>
          <span className={styles.stud} aria-hidden="true" />
          <span className={styles.label}>
            {s.label}
            {s.key === "shipped" && i <= current && trackingUrl && (
              <a href={trackingUrl} target="_blank" rel="noopener">
                Track parcel
              </a>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
