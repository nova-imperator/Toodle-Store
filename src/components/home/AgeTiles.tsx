import Image from "next/image";
import Link from "next/link";
import { AGE_GROUPS } from "@/config/catalogue";
import styles from "./AgeTiles.module.css";

export function AgeTiles() {
  return (
    <ul className={styles.row}>
      {AGE_GROUPS.map((a) => (
        <li key={a.slug}>
          <Link href={`/age/${a.slug}`} className={styles.tile} data-color={a.color}>
            <span className={styles.num}>{a.short}</span>
            <span className={styles.unit}>{a.maxAgeMonths === 24 ? "months" : "years"}</span>
            <Image src={`/images/ages/${a.slug}.webp`} alt="" width={400} height={400} className={styles.art} sizes="140px" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
