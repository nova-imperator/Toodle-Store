"use client";

import { useActionState, useState } from "react";
import { saveProductAction, type ActionState } from "@/app/admin/(panel)/actions";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { slugify } from "@/lib/slug";
import styles from "@/app/admin/admin.module.css";

export interface ProductFormValues {
  name: string;
  slug: string;
  sku: string;
  description: string;
  highlights: string;
  images: string;
  material: string;
  dimensions: string;
  safetyInfo: string;
  mrp: string;
  salePrice: string;
  stockQty: string;
  gstRate: string;
  hsnCode: string;
  brandId: string;
  categoryIds: string[];
  ageGroupIds: string[];
  status: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isDeal: boolean;
  isB2bVisible: boolean;
  seoTitle: string;
  seoDescription: string;
}

interface Option {
  id: string;
  name: string;
}

interface Props {
  productId: string | null;
  initial: ProductFormValues;
  categories: Option[];
  ageGroups: Option[];
  brands: Option[];
  saved?: boolean;
}

export function ProductForm({ productId, initial, categories, ageGroups, brands, saved }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProductAction.bind(null, productId), { error: null, ok: saved ? "Product created." : undefined });
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!!productId);
  const f = state.fields ?? {};

  return (
    <form action={action} className={styles.form}>
      {state.error && <p className={styles.error} role="alert">{state.error}</p>}
      {state.ok && <p className={styles.success} role="status">{state.ok}</p>}

      <section className={styles.panel}>
        <h2>Basics</h2>
        <div className={styles.form}>
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            error={f.name}
            required
          />
          <div className={styles.grid2}>
            <TextField label="URL slug" name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} error={f.slug} hint={`/product/${slug || "…"}`} />
            <TextField label="SKU" name="sku" defaultValue={initial.sku} error={f.sku} />
          </div>
          <TextAreaField label="Description" name="description" defaultValue={initial.description} error={f.description} hint="Write it in your own words, not copied from the brand." />
          <TextAreaField label="Highlights" name="highlights" optional defaultValue={initial.highlights} error={f.highlights} hint="One per line, up to 8." />
          <div className={styles.grid2}>
            <TextField label="Material" name="material" optional defaultValue={initial.material} />
            <TextField label="Dimensions" name="dimensions" optional defaultValue={initial.dimensions} />
          </div>
          <TextField label="Safety information" name="safetyInfo" optional defaultValue={initial.safetyInfo} />
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Images</h2>
        <TextAreaField
          label="Image paths"
          name="images"
          defaultValue={initial.images}
          error={f.images}
          hint="One per line, first is the main photo. Use /images/products/… or an https:// link. Square images (1:1) work best."
        />
      </section>

      <section className={styles.panel}>
        <h2>Price and stock</h2>
        <div className={`${styles.grid2} ${styles.grid3}`}>
          <TextField label="MRP (₹)" name="mrp" type="number" min={1} step="1" defaultValue={initial.mrp} error={f.mrp} />
          <TextField label="Sale price (₹)" name="salePrice" type="number" min={1} step="1" defaultValue={initial.salePrice} error={f.salePrice} />
          <TextField label="Stock" name="stockQty" type="number" min={0} step="1" defaultValue={initial.stockQty} error={f.stockQty} />
          <SelectField label="GST rate" name="gstRate" defaultValue={initial.gstRate} error={f.gstRate}>
            {[0, 5, 12, 18, 28].map((r) => (
              <option key={r} value={r}>{r}%</option>
            ))}
          </SelectField>
          <TextField label="HSN code" name="hsnCode" optional defaultValue={initial.hsnCode} />
          <SelectField label="Brand" name="brandId" defaultValue={initial.brandId}>
            <option value="">No brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </SelectField>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Where it appears</h2>
        <div className={styles.form}>
          <fieldset className={styles.checks}>
            <legend>Categories {f.categoryIds && <span className={styles.error}>{f.categoryIds}</span>}</legend>
            {categories.map((c) => (
              <label key={c.id}>
                <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={initial.categoryIds.includes(c.id)} /> {c.name}
              </label>
            ))}
          </fieldset>
          <fieldset className={styles.checks}>
            <legend>Age groups {f.ageGroupIds && <span className={styles.error}>{f.ageGroupIds}</span>}</legend>
            {ageGroups.map((a) => (
              <label key={a.id}>
                <input type="checkbox" name="ageGroupIds" value={a.id} defaultChecked={initial.ageGroupIds.includes(a.id)} /> {a.name}
              </label>
            ))}
          </fieldset>
          <fieldset className={styles.checks}>
            <legend>Badges</legend>
            <label><input type="checkbox" name="isBestSeller" defaultChecked={initial.isBestSeller} /> Best seller</label>
            <label><input type="checkbox" name="isNewArrival" defaultChecked={initial.isNewArrival} /> New arrival</label>
            <label><input type="checkbox" name="isDeal" defaultChecked={initial.isDeal} /> Deal</label>
            <label><input type="checkbox" name="isB2bVisible" defaultChecked={initial.isB2bVisible} /> Available for B2B</label>
          </fieldset>
          <SelectField label="Status" name="status" defaultValue={initial.status}>
            <option value="active">Active (visible in store)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="archived">Archived (hidden)</option>
          </SelectField>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Search engines</h2>
        <div className={styles.form}>
          <TextField label="SEO title" name="seoTitle" optional maxLength={60} defaultValue={initial.seoTitle} error={f.seoTitle} hint="Under 60 characters. Leave empty to use the product name." />
          <TextAreaField label="SEO description" name="seoDescription" optional maxLength={160} defaultValue={initial.seoDescription} error={f.seoDescription} />
        </div>
      </section>

      <div className={styles.actions}>
        <Button type="submit" variant="ink" size="lg" disabled={pending}>
          {pending ? "Saving…" : productId ? "Save changes" : "Create product"}
        </Button>
        {productId && (
          <a href={`/product/${initial.slug}`} target="_blank" rel="noopener">
            View in store
          </a>
        )}
      </div>
    </form>
  );
}
