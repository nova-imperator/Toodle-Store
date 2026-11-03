import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryTiles.module.css";

interface Tile {
  slug: string;
  name: string;
  image: string | null;
  color: string;
}

export function CategoryTiles({ categories }: { categories: Tile[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((c) => (
        <li key={c.slug}>
          <Link href={`/category/${c.slug}`} className={styles.tile} data-color={c.color}>
            <span className={styles.art}>
              <Image src={c.image ?? `/images/categories/${c.slug}.webp`} alt="" width={480} height={508} sizes="(min-width: 900px) 180px, 31vw" />
            </span>
            <span className={styles.label}>{c.name}</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/shop" className={`${styles.tile} ${styles.all}`}>
          <span className={styles.allArt} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className={styles.label}>All toys</span>
        </Link>
      </li>
    </ul>
  );
}
