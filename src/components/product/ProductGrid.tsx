import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "@/types/catalogue";
import styles from "./ProductGrid.module.css";

export function ProductGrid({ products, wide = false }: { products: ProductCardData[]; wide?: boolean }) {
  return (
    <ul className={`${styles.grid} ${wide ? styles.wide : ""}`}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
