// Imports chosen products from the current WooCommerce site (toodlestore.in) by product link.
// Usage: npm run import:products -- <product url or slug> [more...]
// Saves product data to prisma/data/imported-products.json, photos to public/images/products/wp/,
// then adds the products to the local database (prisma/sync-imported.ts). Deploys add them to production.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const SOURCE = "https://toodlestore.in";
const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_FILE = path.join(ROOT, "prisma", "data", "imported-products.json");
const IMG_DIR = path.join(ROOT, "public", "images", "products", "wp");
const UA = { "User-Agent": "Mozilla/5.0 (ToodleStore importer)" };

// WooCommerce category slug → our category slug.
const CATEGORY_MAP = {
  "remote-control-toys": "remote-control-toys",
  "musical-toys": "musical-toys",
  "cars-vehicles": "cars-and-vehicles",
  "educational-toys": "educational-toys",
  "fun-games": "fun-games",
  "guns-blasters": "toy-guns-and-blasters",
  "kids-puzzles": "kids-puzzles",
  "soft-toys": "soft-toys",
  "buy-action-figures-india": "action-figures",
  "action-figures": "action-figures",
  "dolls-dollhouses": "dolls-and-dollhouses",
  "birthday-gifts": "birthday-gifts",
};

// WooCommerce age tags → our age groups ("3+ years" spans the groups it covers).
const AGE_MAP = {
  "0-24-months": ["0-24-months"],
  "2-years": ["3-5-years"],
  "3-years": ["3-5-years", "5-7-years"],
  "3-5-years": ["3-5-years"],
  "5-years": ["5-7-years", "7-10-years"],
  "5-7-years": ["5-7-years"],
  "7-years": ["7-10-years", "11-plus-years"],
  "7-10-years": ["7-10-years"],
  "11-years": ["11-plus-years"],
};

const slugFrom = (input) => {
  const s = input.trim();
  if (!s.startsWith("http")) return s.replace(/^\/+|\/+$/g, "");
  const m = new URL(s).pathname.match(/\/product\/([^/]+)/);
  if (!m) throw new Error(`Not a product link: ${s}`);
  return m[1];
};

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&times;/g, "×")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&[a-z]+;/g, " ");

/** Turns pasted HTML (Amazon / ChatGPT wrappers) into clean paragraphs and bullet points. */
function cleanHtml(html) {
  const text = decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<\/(p|div|h[1-6]|li|ul|ol|tr|section)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  );
  const lines = text
    .split("\n")
    .map((l) =>
      l
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
        .replace(/(\s*\|\s*)+/g, " | ")
        .replace(/^\s*\|\s*|\s*\|\s*$/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((l) => l && l !== "•");

  // Section titles ("Key Features", "Safe & Reliable") are dropped; short lines under a
  // features-style title are treated as bullet points even when not written as a list.
  const isShort = (l) => l.length < 90 && !/[.!?:]$/.test(l) && !l.includes(": ");
  // Titles are Title Case ("Safe & Reliable"); list items read like sentences ("Durable body with…").
  const isTitle = (l) => {
    const words = l.split(" ").filter((w) => /^[A-Za-z]/.test(w));
    return words.length > 0 && words.filter((w) => /^[A-Z]/.test(w)).length / words.length >= 0.6;
  };
  const bullets = [];
  const paragraphs = [];
  let inList = false;
  for (const l of lines) {
    if (l.startsWith("• ")) bullets.push(l.slice(2).trim());
    else if (inList && isShort(l) && !isTitle(l)) bullets.push(l);
    else if (isShort(l)) inList = /feature|highlight|specification|in the box/i.test(l);
    else {
      paragraphs.push(l);
      inList = false;
    }
  }
  return { paragraphs, bullets };
}

async function downloadImages(slug, images) {
  mkdirSync(IMG_DIR, { recursive: true });
  const saved = [];
  for (const [i, img] of images.slice(0, 6).entries()) {
    const res = await fetch(img.src, { headers: UA });
    if (!res.ok) {
      console.warn(`  ! image ${i + 1} failed (${res.status}): ${img.src}`);
      continue;
    }
    const file = `${slug}-${i + 1}.webp`;
    // Square on white so photos sit consistently in the 1:1 product cards.
    await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(1000, 1000, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .webp({ quality: 85 })
      .toFile(path.join(IMG_DIR, file));
    saved.push({ url: `/images/products/wp/${file}`, alt: decode(img.alt || "").trim() });
  }
  return saved;
}

async function importOne(input) {
  const slug = slugFrom(input);
  const res = await fetch(`${SOURCE}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`, { headers: UA });
  const [p] = res.ok ? await res.json() : [];
  if (!p) throw new Error(`No product found for "${slug}"`);

  const name = decode(p.name).trim();
  const minor = 10 ** p.prices.currency_minor_unit;
  const salePrice = Math.round((+p.prices.price / minor) * 100);
  const mrp = Math.max(Math.round((+(p.prices.regular_price || p.prices.price) / minor) * 100), salePrice);
  const categories = [...new Set(p.categories.map((c) => CATEGORY_MAP[c.slug]).filter(Boolean))];
  const ages = [...new Set(p.tags.flatMap((t) => AGE_MAP[t.slug] ?? []))];
  const tagSlugs = p.tags.map((t) => t.slug);
  const desc = cleanHtml(p.description || "");
  const short = cleanHtml(p.short_description || "");

  const unmapped = p.categories.filter((c) => !CATEGORY_MAP[c.slug]).map((c) => c.slug);
  if (unmapped.length) console.warn(`  ! unknown categories ignored: ${unmapped.join(", ")}`);

  const images = await downloadImages(slug, p.images);
  if (!images.length) console.warn("  ! no photos on the source product; add some in Admin → Products");

  return {
    sourceId: p.id,
    sourceUrl: p.permalink,
    slug,
    name,
    sku: p.sku || `TS-WP-${p.id}`,
    mrp,
    salePrice,
    inStock: p.is_in_stock,
    categories: categories.length ? categories : ["fun-games"],
    ages: ages.length ? ages : ["3-5-years"],
    isBestSeller: tagSlugs.includes("best-seller"),
    isNewArrival: tagSlugs.includes("new-arrival"),
    isDeal: p.on_sale,
    description: [...short.paragraphs, ...desc.paragraphs].filter((l, i, a) => a.indexOf(l) === i && l !== name).join("\n\n"),
    highlights: [...short.bullets, ...desc.bullets].filter((l, i, a) => a.indexOf(l) === i).slice(0, 8),
    images: images.map((img, i) => ({ url: img.url, alt: img.alt || (i === 0 ? name : `${name} – photo ${i + 1}`) })),
    importedAt: new Date().toISOString(),
  };
}

const inputs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!inputs.length) {
  console.error("Usage: npm run import:products -- <product url> [more urls]");
  process.exit(1);
}

const existing = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, "utf8")) : [];
const bySlug = new Map(existing.map((p) => [p.slug, p]));

for (const input of inputs) {
  try {
    console.log(`→ ${input}`);
    const product = await importOne(input);
    bySlug.set(product.slug, product);
    console.log(`  ✓ ${product.name} · ₹${product.salePrice / 100} (MRP ₹${product.mrp / 100}) · ${product.categories.join(", ")} · ${product.ages.join(", ")} · ${product.images.length} photos`);
  } catch (e) {
    console.error(`  ✖ ${e.message}`);
  }
}

writeFileSync(DATA_FILE, JSON.stringify([...bySlug.values()], null, 2) + "\n");
console.log(`\nSaved ${bySlug.size} imported products to prisma/data/imported-products.json`);

const { status } = spawnSync("npx tsx prisma/sync-imported.ts --update", { stdio: "inherit", shell: true, cwd: ROOT });
process.exit(status ?? 0);
