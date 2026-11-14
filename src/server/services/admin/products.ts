import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import type { ProductFormInput } from "@/lib/validation/adminProduct";
import { ADMIN_PAGE } from "./orders";

/** On/off flags the admin can flip straight from the product list. */
export const PRODUCT_FLAGS = {
  isFeatured: "Featured",
  isBestSeller: "Best seller",
  isNewArrival: "New arrival",
  isDeal: "Deal",
} as const;
export type ProductFlag = keyof typeof PRODUCT_FLAGS;

export async function setProductFlag(id: string, flag: ProductFlag, value: boolean) {
  await db.product.update({ where: { id }, data: { [flag]: value } });
}

/** "On website" switch: active products show in the store, drafts are hidden. */
export async function setProductVisible(id: string, visible: boolean) {
  await db.product.update({ where: { id }, data: { status: visible ? "active" : "draft" } });
}

export async function listProducts({ q, page = 1, featured = false }: { q?: string; page?: number; featured?: boolean }) {
  const where: Prisma.ProductWhereInput = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {}),
    ...(featured ? { isFeatured: true } : {}),
  };
  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * ADMIN_PAGE,
      take: ADMIN_PAGE,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } }, brand: { select: { name: true } } },
    }),
    db.product.count({ where }),
  ]);
  return { rows, total, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE)) };
}

export function getProductForEdit(id: string) {
  return db.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } }, categories: true, ageGroups: true } });
}

export async function getTaxonomy() {
  const [categories, ageGroups, brands] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.ageGroup.findMany({ orderBy: { minAgeMonths: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { categories, ageGroups, brands };
}

export async function saveProduct(id: string | null, input: ProductFormInput) {
  const clash = await db.product.findFirst({ where: { OR: [{ slug: input.slug }, { sku: input.sku }], ...(id ? { id: { not: id } } : {}) } });
  if (clash) throw new AppError("duplicate", clash.slug === input.slug ? "Another product already uses this slug." : "Another product already uses this SKU.", 409);

  const data = {
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    description: input.description,
    highlights: input.highlights,
    material: input.material || null,
    dimensions: input.dimensions || null,
    safetyInfo: input.safetyInfo || null,
    mrp: Math.round(input.mrp * 100),
    salePrice: Math.round(input.salePrice * 100),
    stockQty: input.stockQty,
    gstRate: input.gstRate,
    hsnCode: input.hsnCode || null,
    brandId: input.brandId || null,
    status: input.status,
    isBestSeller: input.isBestSeller,
    isNewArrival: input.isNewArrival,
    isDeal: input.isDeal,
    isFeatured: input.isFeatured,
    isB2bVisible: input.isB2bVisible,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
  const images = input.images.map((url, i) => ({ url, altText: i === 0 ? input.name : `${input.name} – photo ${i + 1}`, sortOrder: i }));

  return db.$transaction(async (tx) => {
    const product = id ? await tx.product.update({ where: { id }, data }) : await tx.product.create({ data });
    await tx.productImage.deleteMany({ where: { productId: product.id } });
    await tx.productCategory.deleteMany({ where: { productId: product.id } });
    await tx.productAgeGroup.deleteMany({ where: { productId: product.id } });
    await tx.productImage.createMany({ data: images.map((img) => ({ ...img, productId: product.id })) });
    await tx.productCategory.createMany({ data: input.categoryIds.map((categoryId) => ({ productId: product.id, categoryId })) });
    await tx.productAgeGroup.createMany({ data: input.ageGroupIds.map((ageGroupId) => ({ productId: product.id, ageGroupId })) });
    return product;
  });
}
