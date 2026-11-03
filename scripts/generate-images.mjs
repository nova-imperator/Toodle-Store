// Generates every image the site needs, locally, into public/images.
// Usage: npm run images
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CATEGORIES, AGE_GROUPS } from "../src/config/catalogue.ts";
import { PRODUCTS } from "../prisma/data/products.ts";
import { slugify } from "../src/lib/slug.ts";
import { productMain, productBox, productDetail, HERO_ART, AGE_ART, funGamesTile } from "./images/compose.mjs";
import { processLogo, processMascot, processBanner, processCategoryTile, writeIcons } from "./images/brand.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "My Sample Images");
const OUT = path.join(ROOT, "public", "images");
const dirs = ["brand", "categories", "products", "hero", "ages"].map((d) => path.join(OUT, d));

const render = (svgText, file, opts = {}) =>
  sharp(Buffer.from(svgText), { density: opts.density ?? 96 })
    .resize(opts.width)
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(file);

async function brand() {
  const logo = await processLogo(path.join(SOURCE, "WhatsApp Image 2026-11-02 at 7.15.42 PM.jpeg"), dirs[0]);
  await processMascot(path.join(SOURCE, "WhatsApp Image 2026-11-02 at 7.15.42 PM (1).jpeg"), dirs[0]);
  await processBanner(path.join(SOURCE, "WhatsApp Image 2026-11-02 at 7.11.53 PM.jpeg"), dirs[0]);
  await writeIcons(logo, path.join(ROOT, "src", "app"));
  console.log("✓ brand assets");
}

async function categories() {
  for (const c of CATEGORIES) {
    const file = path.join(dirs[1], `${c.slug}.webp`);
    if (c.source) await processCategoryTile(path.join(SOURCE, c.source), file);
    else await render(funGamesTile(), file, { width: 480, density: 144 });
  }
  console.log(`✓ ${CATEGORIES.length} category tiles`);
}

async function products() {
  const colorOf = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.color]));
  await Promise.all(PRODUCTS.map(async (p) => {
    const slug = slugify(p.name);
    const color = colorOf[p.categories[0]];
    await render(productMain(p.art, color), path.join(dirs[2], `${slug}-1.webp`));
    await render(productBox(p.art, color), path.join(dirs[2], `${slug}-2.webp`));
    await render(productDetail(p.art, color), path.join(dirs[2], `${slug}-3.webp`));
  }));
  console.log(`✓ ${PRODUCTS.length * 3} product images`);
}

async function heroAndAges() {
  for (const [name, build] of Object.entries(HERO_ART)) {
    await render(build(), path.join(dirs[3], `${name}.webp`), { width: 1000, density: 144 });
  }
  for (const a of AGE_GROUPS) {
    await render(AGE_ART[a.slug](), path.join(dirs[4], `${a.slug}.webp`), { width: 400, density: 144 });
  }
  console.log("✓ hero and age artwork");
}

await Promise.all([...dirs, path.join(ROOT, "src", "app")].map((d) => mkdir(d, { recursive: true })));
await brand();
await categories();
await products();
await heroAndAges();
