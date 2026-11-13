// Removes the generated sample catalogue (SKUs like TS-RC-001) and the placeholder brands from
// databases that were seeded before real products were imported. Safe to run on every deploy.
import { PrismaClient } from "@prisma/client";

const SAMPLE_SKU = /^TS-(AF|FG|CV|DD|ED|PZ|MU|RC|ST|TG|BG)-\d{3}$/;
const PLACEHOLDER_BRANDS = ["toodle-originals", "playnest", "zoomies", "tinytune", "brightminds", "cuddleco"];

const prisma = new PrismaClient();

async function main() {
  const candidates = await prisma.product.findMany({ where: { sku: { startsWith: "TS-" } }, select: { id: true, sku: true } });
  const ids = candidates.filter((p) => SAMPLE_SKU.test(p.sku)).map((p) => p.id);

  // Order history keeps its name/price snapshots; order_items.product_id is set to null on delete.
  const removed = ids.length ? (await prisma.product.deleteMany({ where: { id: { in: ids } } })).count : 0;
  const brands = await prisma.brand.deleteMany({ where: { slug: { in: PLACEHOLDER_BRANDS }, products: { none: {} } } });

  if (removed || brands.count) console.log(`Removed ${removed} sample products and ${brands.count} placeholder brands.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
