import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/server/auth/admin";
import { PRODUCT_FLAGS, listProducts, type ProductFlag } from "@/server/services/admin/products";
import { Pager, listHref } from "@/components/admin/AdminBits";
import { ButtonLink } from "@/components/ui/Button";
import { formatPaise } from "@/lib/money";
import { toggleProductAction } from "../actions";
import styles from "../../admin.module.css";

export const metadata = { title: "Products" };

/** One on/off switch; submitting flips the value. */
function Switch({ productId, flag, on, label }: { productId: string; flag: string; on: boolean; label: string }) {
  return (
    <form action={toggleProductAction.bind(null, productId, flag, !on)}>
      <button type="submit" role="switch" aria-checked={on} aria-label={label} title={`${label}: ${on ? "on" : "off"}`} className={styles.switch} />
    </form>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; featured?: string }> }) {
  await requireAdmin("products");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const featured = sp.featured === "1";
  const { rows, total, pageCount } = await listProducts({ q: sp.q?.trim(), page, featured });
  const flags = Object.entries(PRODUCT_FLAGS) as [ProductFlag, string][];

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Products</h1>
          <p className={styles.sub}>
            {total} {featured ? "featured " : ""}products · flip a switch to change it straight away
          </p>
        </div>
        <ButtonLink href="/admin/products/new" variant="ink" size="sm">
          Add product
        </ButtonLink>
      </div>
      <div className={styles.toolbar}>
        <form>
          <input name="q" defaultValue={sp.q} placeholder="Search name or SKU" aria-label="Search products" />
          {featured && <input type="hidden" name="featured" value="1" />}
        </form>
        <nav className={styles.tabs} aria-label="Product filter">
          <Link href={listHref("/admin/products", { q: sp.q })} aria-current={!featured ? "true" : undefined}>All</Link>
          <Link href={listHref("/admin/products", { q: sp.q, featured: "1" })} aria-current={featured ? "true" : undefined}>Featured</Link>
        </nav>
      </div>
      <div className={styles.tableWrap}>
        {rows.length === 0 ? (
          <p className={styles.empty}>No products found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th /><th>Product</th><th className={styles.num}>Price</th><th className={styles.num}>Stock</th>
                <th>On website</th>
                {flags.map(([, label]) => <th key={label}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.images[0] && <Image src={p.images[0].url} alt="" width={40} height={40} className={styles.thumb} />}</td>
                  <td className={styles.wrap}>
                    <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                    <br /><small className={styles.sub}>{p.sku}</small>
                  </td>
                  <td className={styles.num}>{formatPaise(p.salePrice)}<br /><small><s>{formatPaise(p.mrp)}</s></small></td>
                  <td className={styles.num}>
                    <span className={styles.pill} data-tone={p.stockQty === 0 ? "red" : p.stockQty <= 5 ? "yellow" : "green"}>{p.stockQty}</span>
                  </td>
                  <td><Switch productId={p.id} flag="visible" on={p.status === "active"} label={`${p.name} on website`} /></td>
                  {flags.map(([flag, label]) => (
                    <td key={flag}><Switch productId={p.id} flag={flag} on={p[flag]} label={`${p.name}: ${label}`} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pager page={page} pageCount={pageCount} href={(n) => listHref("/admin/products", { q: sp.q, featured: featured ? "1" : undefined, page: n })} />
    </>
  );
}
