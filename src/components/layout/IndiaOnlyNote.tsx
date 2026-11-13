import { Icon } from "@/components/ui/Icon";
import { DELIVERY_REGION_NOTE } from "@/config/shipping";
import styles from "./IndiaOnlyNote.module.css";

/** "We deliver only within India" notice used on the home page and at checkout. */
export function IndiaOnlyNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`${styles.note} ${compact ? styles.compact : ""}`} role="note">
      <span className={styles.icon} aria-hidden="true">
        <Icon name="pin" size={compact ? 18 : 22} />
      </span>
      <span>
        <strong>{DELIVERY_REGION_NOTE.title}.</strong> {DELIVERY_REGION_NOTE.text}
      </span>
    </p>
  );
}
