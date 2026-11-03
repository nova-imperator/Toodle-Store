import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { AGE_GROUPS, type BrickColor } from "@/config/catalogue";
import type { ListingFilters, ListingResult, ProductCardData } from "@/types/catalogue";

export const PAGE_SIZE = 24;

const cardSelect = {
  id: true,
  slug: true,
  name: true,
  mrp: true,
  salePrice: true,
  stockQty: true,
  isNewArrival: true,
  brand: { select: { name: true } },
  images: { select: { url: true, altText: true }, orderBy: { sortOrder: "asc" }, take: 1 },
  ageGroups: { select: { ageGroup: { select: { slug: true, minAgeMonths: true } } } },
  categories: { select: { category: { select: { color: true, sortOrder: true } } } },
} satisfies Prisma.ProductSelect;

type CardRow = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

const ageShort = new Map(AGE_GROUPS.map((a) => [a.slug, a.short]));

function toCard(p: CardRow): ProductCardData {
  const youngest = [...p.ageGroups].sort((a, b) => a.ageGroup.minAgeMonths - b.ageGroup.minAgeMonths)[0];
  const primary = [...p.categories].sort((a, b) => a.category.sortOrder - b.category.sortOrder)[0];
  const short = youngest ? ageShort.get(youngest.ageGroup.slug) : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name ?? null,
    mrp: p.mrp,
    salePrice: p.salePrice,
    image: p.images[0]?.url ?? "/images/brand/logo.webp",
    imageAlt: p.images[0]?.altText ?? p.name,
    ageLabel: short ? (short === "0–2" ? "0–24 m" : `${short} yrs`) : null,
    color: (primary?.category.color as BrickColor) ?? "blue",
    inStock: p.stockQty > 0,
    isNew: p.isNewArrival,
  };
}

const active: Prisma.ProductWhereInput = { status: "active" };

function buildWhere(f: ListingFilters): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [active];
  if (f.category) and.push({ categories: { some: { category: { slug: f.category } } } });
  if (f.age) and.push({ ageGroups: { some: { ageGroup: { slug: f.age } } } });
  if (f.brand) and.push({ brand: { slug: f.brand } });
  if (f.ages?.length) and.push({ ageGroups: { some: { ageGroup: { slug: { in: f.ages } } } } });
  if (f.brands?.length) and.push({ brand: { slug: { in: f.brands } } });
  if (f.min != null) and.push({ salePrice: { gte: f.min * 100 } });
  if (f.max != null) and.push({ salePrice: { lte: f.max * 100 } });
  if (f.flag === "best") and.push({ isBestSeller: true });
  if (f.flag === "new") and.push({ isNewArrival: true });
  if (f.flag === "deal") and.push({ isDeal: true });
  if (f.q) {
    const words = f.q.trim().split(/\s+/).filter(Boolean).slice(0, 6);
    for (const w of words) {
      and.push({
        OR: [
          { name: { contains: w, mode: "insensitive" } },
          { description: { contains: w, mode: "insensitive" } },
          { brand: { name: { contains: w, mode: "insensitive" } } },
          { categories: { some: { category: { name: { contains: w, mode: "insensitive" } } } } },
        ],
      });
    }
  }
  return { AND: and };
}

const ORDER: Record<NonNullable<ListingFilters["sort"]>, Prisma.ProductOrderByWithRelationInput[]> = {
  popular: [{ isBestSeller: "desc" }, { stockQty: "desc" }, { name: "asc" }],
  newest: [{ isNewArrival: "desc" }, { createdAt: "desc" }],
  "price-asc": [{ salePrice: "asc" }],
  "price-desc": [{ salePrice: "desc" }],
};

export async function listProducts(f: ListingFilters): Promise<ListingResult> {
  const page = Math.max(1, f.page ?? 1);
  const where = buildWhere(f);
  // Facet counts ignore the facet's own selection so shoppers can widen a filter.
  const ageWhere = buildWhere({ ...f, ages: undefined });
  const brandWhere = buildWhere({ ...f, brands: undefined });

  const [rows, total, ageRows, brandRows] = await Promise.all([
    db.product.findMany({ where, select: cardSelect, orderBy: ORDER[f.sort ?? "popular"], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.product.count({ where }),
    db.ageGroup.findMany({
      orderBy: { minAgeMonths: "asc" },
      select: { slug: true, name: true, _count: { select: { products: { where: { product: ageWhere } } } } },
    }),
    db.brand.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true, _count: { select: { products: { where: brandWhere } } } },
    }),
  ]);

  return {
    items: rows.map(toCard),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    facets: {
      ages: ageRows.map((a) => ({ slug: a.slug, name: a.name, count: a._count.products })).filter((a) => a.count > 0),
      brands: brandRows.map((b) => ({ slug: b.slug, name: b.name, count: b._count.products })).filter((b) => b.count > 0),
    },
  };
}

async function cards(where: Prisma.ProductWhereInput, take = 12, orderBy: Prisma.ProductOrderByWithRelationInput[] = ORDER.popular) {
  const rows = await db.product.findMany({ where: { AND: [active, where] }, select: cardSelect, orderBy, take });
  return rows.map(toCard);
}

export async function getHomeData() {
  const [banners, categories, ageGroups, brands, bestSellers, newArrivals, deals] = await Promise.all([
    db.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.category.findMany({ where: { parentId: null }, orderBy: { sortOrder: "asc" } }),
    db.ageGroup.findMany({ orderBy: { minAgeMonths: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
    cards({ isBestSeller: true }),
    cards({ isNewArrival: true }, 12, ORDER.newest),
    cards({ isDeal: true }),
  ]);
  return { banners, categories, ageGroups, brands, bestSellers, newArrivals, deals };
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findFirst({
    where: { slug, status: "active" },
    include: {
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true }, orderBy: { category: { sortOrder: "asc" } } },
      ageGroups: { include: { ageGroup: true }, orderBy: { ageGroup: { minAgeMonths: "asc" } } },
      reviews: { where: { status: "approved" }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!product) return null;

  const categoryIds = product.categories.map((c) => c.categoryId);
  const related = await cards({ id: { not: product.id }, categories: { some: { categoryId: { in: categoryIds } } } }, 10);
  return { product, related };
}

export const getCategoryBySlug = (slug: string) => db.category.findUnique({ where: { slug } });
export const getAgeGroupBySlug = (slug: string) => db.ageGroup.findUnique({ where: { slug } });
export const getBrandBySlug = (slug: string) => db.brand.findUnique({ where: { slug } });
export const getAllBrands = () => db.brand.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });

export async function getRecentReviews(take = 6) {
  const rows = await db.review.findMany({
    where: { status: "approved", comment: { not: null } },
    orderBy: { createdAt: "desc" },
    take,
    include: { user: { select: { name: true } }, product: { select: { name: true, slug: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    author: r.user.name?.split(" ")[0] ?? "A parent",
    productName: r.product.name,
    productSlug: r.product.slug,
  }));
}

export async function findGifts(ageSlug: string, maxRupees: number) {
  return cards({ ageGroups: { some: { ageGroup: { slug: ageSlug } } }, salePrice: { lte: maxRupees * 100 } }, 8);
}

export async function getProductsByIds(ids: string[]) {
  const rows = await db.product.findMany({ where: { id: { in: ids }, status: "active" }, select: cardSelect });
  return rows.map(toCard);
}
