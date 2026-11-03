import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import { listProducts } from "@/server/services/admin/products";
import { Pager, listHref } from "@/components/admin/AdminBits";
import { ButtonLink } from "@/components/ui/Button";
import { formatPaise } from "@/lib/money";
import styles from "../../admin.module.css";

export const metadata = { title: "Products" };

const STATUS_TONE = { active: "green", draft: "yellow", archived: "grey" } as const;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdmin("products");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageCount } = await listProducts({ q: sp.q?.trim(), page });

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Products</h1>
          <p className={styles.sub}>{total} products</p>
        </div>
        <ButtonLink href="/admin/products/new" variant="ink" size="sm">
          Add product
        </ButtonLink>
      </div>
      <div className={styles.toolbar}>
        <form>
          <input name="q" defaultValue={sp.q} placeholder="Search name or SKU" aria-label="Search products" />
        </form>
      </div>
      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th /><th>Product</th><th>SKU</th><th>Brand</th><th className={styles.num}>Price</th><th className={styles.num}>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.images[0] && <Image src={p.images[0].url} alt="" width={40} height={40} className={styles.thumb} />}</td>
                  <td className={styles.wrap}><Link href={`/admin/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.sku}</td>
                  <td>{p.brand?.name ?? "—"}</td>
                  <td className={styles.num}>{formatPaise(p.salePrice)}<br /><small><s>{formatPaise(p.mrp)}</s></small></td>
                  <td className={styles.num}>
                    <span className={styles.pill} data-tone={p.stockQty === 0 ? "red" : p.stockQty <= 5 ? "yellow" : "green"}>{p.stockQty}</span>
                  </td>
                  <td><span className={styles.pill} data-tone={STATUS_TONE[p.status]}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={page} pageCount={pageCount} href={(p) => listHref("/admin/products", { q: sp.q, page: p })} />
    </>
  );
}
