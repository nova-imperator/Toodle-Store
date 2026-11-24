// Live payment test product (owner, 24 Nov 2026). Runs on every deploy.
// ENABLED = true  → creates/refreshes a hidden ₹2 product at /product/live-payment-test
// ENABLED = false → deletes it (order history keeps its own name/price copy).
// SKU starts with TEST- so it is hidden from the shop and skips minimum order + delivery (see src/config/shipping.ts).
import { PrismaClient } from "@prisma/client";

const ENABLED = false; // tested on 24 Nov 2026; deploy removes it

const SKU = "TEST-LIVE-2";
const prisma = new PrismaClient();

async function main() {
  if (!ENABLED) {
    const { count } = await prisma.product.deleteMany({ where: { sku: SKU } });
    if (count) console.log("Removed the live payment test product.");
    return;
  }

  const [category, age] = await Promise.all([
    prisma.category.findFirst({ orderBy: { sortOrder: "asc" }, select: { id: true } }),
    prisma.ageGroup.findFirst({ orderBy: { minAgeMonths: "asc" }, select: { id: true } }),
  ]);
  const data = {
    name: "Live Payment Test",
    slug: "live-payment-test",
    description: "Temporary product for testing live payments. Not for sale.",
    mrp: 200,
    salePrice: 200,
    stockQty: 20,
    gstRate: 0,
    status: "active" as const,
    isB2bVisible: false,
  };
  const product = await prisma.product.upsert({ where: { sku: SKU }, update: data, create: { ...data, sku: SKU } });
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.create({ data: { productId: product.id, url: "/images/brand/logo.webp", altText: "Toodle Store", sortOrder: 0 } });
  if (category) await prisma.productCategory.upsert({ where: { productId_categoryId: { productId: product.id, categoryId: category.id } }, update: {}, create: { productId: product.id, categoryId: category.id } });
  if (age) await prisma.productAgeGroup.upsert({ where: { productId_ageGroupId: { productId: product.id, ageGroupId: age.id } }, update: {}, create: { productId: product.id, ageGroupId: age.id } });
  console.log("Live payment test product ready at /product/live-payment-test (₹2).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
