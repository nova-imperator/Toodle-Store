import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.img} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
