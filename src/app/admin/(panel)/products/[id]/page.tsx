import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/admin";
import { getProductForEdit, getTaxonomy } from "@/server/services/admin/products";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import styles from "../../../admin.module.css";

export const metadata = { title: "Edit product" };

const EMPTY: ProductFormValues = {
  name: "", slug: "", sku: "", description: "", highlights: "", images: "", material: "", dimensions: "", safetyInfo: "",
  mrp: "", salePrice: "", stockQty: "0", gstRate: "18", hsnCode: "9503", brandId: "", categoryIds: [], ageGroupIds: [],
  status: "draft", isBestSeller: false, isNewArrival: true, isDeal: false, isB2bVisible: true, seoTitle: "", seoDescription: "",
};

export default async function ProductEditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("products");
  const { id } = await params;
  const isNew = id === "new";
  const [product, taxonomy] = await Promise.all([isNew ? null : getProductForEdit(id), getTaxonomy()]);
  if (!isNew && !product) notFound();

  const initial: ProductFormValues = product
    ? {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        highlights: product.highlights.join("\n"),
        images: product.images.map((i) => i.url).join("\n"),
        material: product.material ?? "",
        dimensions: product.dimensions ?? "",
        safetyInfo: product.safetyInfo ?? "",
        mrp: String(product.mrp / 100),
        salePrice: String(product.salePrice / 100),
        stockQty: String(product.stockQty),
        gstRate: String(product.gstRate),
        hsnCode: product.hsnCode ?? "",
        brandId: product.brandId ?? "",
        categoryIds: product.categories.map((c) => c.categoryId),
        ageGroupIds: product.ageGroups.map((a) => a.ageGroupId),
        status: product.status,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        isDeal: product.isDeal,
        isB2bVisible: product.isB2bVisible,
        seoTitle: product.seoTitle ?? "",
        seoDescription: product.seoDescription ?? "",
      }
    : EMPTY;

  return (
    <>
      <div className={styles.pageHead}>
        <h1>{product ? product.name : "New product"}</h1>
        <Link href="/admin/products">All products</Link>
      </div>
      <ProductForm
        key={product?.updatedAt.toISOString() ?? "new"}
        productId={product?.id ?? null}
        initial={initial}
        categories={taxonomy.categories}
        ageGroups={taxonomy.ageGroups}
        brands={taxonomy.brands}
        saved={(await searchParams).saved === "1"}
      />
    </>
  );
}
