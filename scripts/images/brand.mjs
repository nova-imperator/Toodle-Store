// Prepares the owner's artwork from My Sample Images/ for the web.
import sharp from "sharp";

const NEAR_WHITE = 232;
const EDGE_SOFT = 200;

/**
 * Makes the white background transparent by flood-filling from the image border,
 * so white details inside the artwork (eyes, collars) stay opaque.
 */
async function removeWhiteBackground(input, { fromBottom = true } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const minAt = (p) => Math.min(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);
  const seen = new Uint8Array(width * height);
  const queue = [];
  const seed = (x, y) => {
    const p = y * width + x;
    if (!seen[p] && minAt(p) >= NEAR_WHITE) { seen[p] = 1; queue.push(p); }
  };
  for (let x = 0; x < width; x++) { seed(x, 0); if (fromBottom) seed(x, height - 1); }
  for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width, y = (p - x) / width;
    if (x > 0) seed(x - 1, y);
    if (x < width - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < height - 1) seed(x, y + 1);
  }

  for (let p = 0; p < width * height; p++) {
    if (seen[p]) { data[p * 4 + 3] = 0; continue; }
    const x = p % width, y = (p - x) / width;
    const touchesBg = (x > 0 && seen[p - 1]) || (x < width - 1 && seen[p + 1]) || (y > 0 && seen[p - width]) || (y < height - 1 && seen[p + width]);
    const m = minAt(p);
    if (touchesBg && m > EDGE_SOFT) data[p * 4 + 3] = Math.round(255 * (255 - m) / (255 - EDGE_SOFT));
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

export async function processLogo(src, outDir) {
  const clean = await sharp(await removeWhiteBackground(src)).trim().png().toBuffer();
  await sharp(clean).resize(520).webp({ quality: 90 }).toFile(`${outDir}/logo.webp`);
  await sharp(clean).resize(520).png().toFile(`${outDir}/logo.png`);
  return clean;
}

export async function processMascot(src, outDir) {
  const clean = await sharp(await removeWhiteBackground(src)).trim().png().toBuffer();
  await sharp(clean).resize({ height: 520 }).webp({ quality: 88 }).toFile(`${outDir}/mascot-delivery.webp`);
}

export async function processBanner(src, outDir) {
  await sharp(src).resize(900).webp({ quality: 82 }).toFile(`${outDir}/store-banner.webp`);
}

/** Crops the baked-in label off an owner's category tile so the name can be real text. */
export async function processCategoryTile(src, outFile) {
  const cropped = await sharp(src).extract({ left: 0, top: 0, width: 685, height: 725 }).png().toBuffer();
  const clean = await removeWhiteBackground(cropped, { fromBottom: false });
  await sharp(clean).resize(480).webp({ quality: 88, alphaQuality: 90 }).toFile(outFile);
}

/** App icons from the logo's rocket + lettering, padded on the brand cream. */
export async function writeIcons(logoPng, appDir) {
  const square = await sharp(logoPng)
    .resize(440, 440, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 36, bottom: 36, left: 36, right: 36, background: { r: 255, g: 248, b: 234, alpha: 1 } })
    .flatten({ background: "#FFF8EA" })
    .png()
    .toBuffer();
  await sharp(square).resize(256).toFile(`${appDir}/icon.png`);
  await sharp(square).resize(180).toFile(`${appDir}/apple-icon.png`);
}
