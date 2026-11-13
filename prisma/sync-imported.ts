// Adds products from prisma/data/imported-products.json to the database.
// Deploys run it without flags: only missing products are created, so admin edits are never overwritten.
// The importer runs it with --update to refresh products it just re-imported (local database).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

interface Imported {
  slug: string;
  name: string;
  sku: string;
  mrp: number;
  salePrice: number;
  inStock: boolean;
  categories: string[];
  ages: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  isDeal: boolean;
  description: string;
  highlights: string[];
  images: { url: string; alt: string }[];
}

/** WooCommerce doesn't share stock counts publicly, so imported in-stock items start at this quantity. */
const DEFAULT_STOCK = 25;

const prisma = new PrismaClient();

async function main() {
  const file = path.join(import.meta.dirname, "data", "imported-products.json");
  if (!existsSync(file)) return;
  const products: Imported[] = JSON.parse(readFileSync(file, "utf8"));
  const update = process.argv.includes("--update");

  const [categories, ages] = await Promise.all([prisma.category.findMany(), prisma.ageGroup.findMany()]);
  if (!categories.length) {
    console.log("Catalogue not loaded yet; skipping imported products.");
    return;
  }
  const catId = new Map(categories.map((c) => [c.slug, c.id]));
  const ageId = new Map(ages.map((a) => [a.slug, a.id]));

  let created = 0;
  let updated = 0;
  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing && !update) continue;

    const data = {
      name: p.name,
      sku: p.sku,
      description: p.description || p.name,
      highlights: p.highlights,
      // Real products: no safety claim until the team adds a verified one in Admin → Products.
      safetyInfo: null,
      mrp: p.mrp,
      salePrice: p.salePrice,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      isDeal: p.isDeal,
      hsnCode: "9503",
      gstRate: 18,
      seoTitle: `${p.name} – Buy Online`.slice(0, 60),
      seoDescription: (p.description || p.name).replace(/\s+/g, " ").slice(0, 155),
    };
    const relations = {
      categories: { create: p.categories.filter((c) => catId.has(c)).map((c) => ({ categoryId: catId.get(c)! })) },
      ageGroups: { create: p.ages.filter((a) => ageId.has(a)).map((a) => ({ ageGroupId: ageId.get(a)! })) },
      images: { create: p.images.map((img, i) => ({ url: img.url, altText: img.alt, sortOrder: i })) },
    };

    if (existing) {
      await prisma.$transaction([
        prisma.productCategory.deleteMany({ where: { productId: existing.id } }),
        prisma.productAgeGroup.deleteMany({ where: { productId: existing.id } }),
        prisma.productImage.deleteMany({ where: { productId: existing.id } }),
        prisma.product.update({ where: { id: existing.id }, data: { ...data, ...relations } }),
      ]);
      updated++;
    } else {
      await prisma.product.create({ data: { ...data, slug: p.slug, stockQty: p.inStock ? DEFAULT_STOCK : 0, status: "active", ...relations } });
      created++;
    }
  }
  console.log(`Imported products: ${created} added, ${updated} updated, ${products.length - created - updated} already present.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
