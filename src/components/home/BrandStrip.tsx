import Link from "next/link";
import styles from "./BrandStrip.module.css";

const COLORS = ["red", "blue", "yellow", "green", "orange"] as const;

export function BrandStrip({ brands }: { brands: { slug: string; name: string }[] }) {
  return (
    <ul className={styles.strip}>
      {brands.map((b, i) => (
        <li key={b.slug}>
          <Link href={`/brand/${b.slug}`} className={styles.brand} data-color={COLORS[i % COLORS.length]}>
            {b.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
