// Builds the photo banners for the wholesale (B2B) site and the social share images, from the real
// product photos in public/images/products/wp. No cartoon art.
//
// Own photos: put any of these in "My Sample Images/b2b/" and run again (`node scripts/build-b2b-images.mjs`):
//   hero.jpg  – wholesale stock / warehouse / shop shelves (landscape)  → replaces the product collage
//   cta.jpg   – packed cartons / dispatch (landscape)                   → replaces the bottom banner photo
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PRODUCTS = path.join(ROOT, "public/images/products/wp");
const OWN = path.join(ROOT, "My Sample Images/b2b");
const OUT_B2B = path.join(ROOT, "public/images/b2b");
const OUT_OG = path.join(ROOT, "public/images/og");
const p = (name) => path.join(PRODUCTS, `${name}.webp`);

const INK = "#1D2B53";
const PAPER = "#FFF8EA";

const roundMask = (w, h, r) => Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`);

/** One photo, cover-cropped to w×h with rounded corners (transparent outside). */
async function tile(file, w, h, r = 18, position = "centre") {
  return sharp(file).resize(w, h, { fit: "cover", position }).composite([{ input: roundMask(w, h, r), blend: "dest-in" }]).png().toBuffer();
}

/** Grid of photos on a transparent or coloured canvas. */
async function collage({ files, cols, rows, width, height, gap = 16, radius = 18, background = { r: 0, g: 0, b: 0, alpha: 0 } }) {
  const cw = Math.floor((width - gap * (cols - 1)) / cols);
  const ch = Math.floor((height - gap * (rows - 1)) / rows);
  const layers = await Promise.all(
    files.slice(0, cols * rows).map(async (f, i) => ({
      input: await tile(f, cw, ch, radius),
      left: (i % cols) * (cw + gap),
      top: Math.floor(i / cols) * (ch + gap),
    })),
  );
  return sharp({ create: { width, height, channels: 4, background } }).composite(layers);
}

async function ownOr(name, w, h, fallback) {
  const own = ["jpg", "jpeg", "png", "webp"].map((e) => path.join(OWN, `${name}.${e}`)).find(existsSync);
  if (own) {
    console.log(`using your photo ${path.relative(ROOT, own)}`);
    return sharp(await tile(own, w, h, 22));
  }
  return fallback();
}

await mkdir(OUT_B2B, { recursive: true });
await mkdir(OUT_OG, { recursive: true });

// 1. Hero (wholesale landing): stock collage of real products.
const hero = await ownOr("hero", 1200, 900, () =>
  collage({
    files: [
      p("educational-laptop-for-kids-india-1"),
      p("dancing-cactus-toy-india-2"),
      p("fighter-jet-toys-1"),
      p("princess-house-set-dollhouse-toy-for-kids-5-years-3"),
      p("strike-gun-with-6-bullet-1"),
      p("lcd-writing-tablet-kids-2"),
    ],
    cols: 3,
    rows: 2,
    width: 1200,
    height: 900,
  }),
);
await hero.webp({ quality: 82 }).toFile(path.join(OUT_B2B, "hero.webp"));

// 2. Bottom call-to-action banner: a wide strip of products.
const cta = await ownOr("cta", 1200, 400, () =>
  collage({
    files: [
      p("radish-rabbit-toy-phone-india-1"),
      p("nail-polish-organic-makeup-set-dollhouse-toy-for-kids-5-years-1"),
      p("fighter-jet-toys-2"),
      p("educational-laptop-for-kids-india-2"),
    ],
    cols: 4,
    rows: 1,
    width: 1200,
    height: 400,
    gap: 12,
  }),
);
await cta.webp({ quality: 80 }).toFile(path.join(OUT_B2B, "cta.webp"));

// 3. Social share images (1200×630): logo card + product collage.
async function shareImage(out, { background, files, cardBg }) {
  const logo = await sharp(path.join(ROOT, "public/images/brand/logo.png")).resize(360, 340, { fit: "contain", background: cardBg }).png().toBuffer();
  const card = await sharp({ create: { width: 420, height: 420, channels: 4, background: cardBg } })
    .composite([{ input: logo, left: 30, top: 40 }, { input: roundMask(420, 420, 36), blend: "dest-in" }])
    .png()
    .toBuffer();
  const grid = await (await collage({ files, cols: 2, rows: 2, width: 620, height: 550, gap: 14, radius: 20 })).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
    .composite([
      { input: card, left: 60, top: 105 },
      { input: grid, left: 540, top: 40 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
}

await shareImage(path.join(OUT_OG, "store.jpg"), {
  background: PAPER,
  cardBg: "#FFFFFF",
  files: [p("dancing-cactus-toy-india-2"), p("educational-laptop-for-kids-india-1"), p("princess-house-set-dollhouse-toy-for-kids-5-years-3"), p("radish-rabbit-toy-phone-india-1")],
});
await shareImage(path.join(OUT_OG, "b2b.jpg"), {
  background: INK,
  cardBg: "#FFFFFF",
  files: [p("fighter-jet-toys-1"), p("strike-gun-with-6-bullet-1"), p("lcd-writing-tablet-kids-2"), p("nail-polish-organic-makeup-set-dollhouse-toy-for-kids-5-years-1")],
});

console.log("wrote public/images/b2b/{hero,cta}.webp and public/images/og/{store,b2b}.jpg");
