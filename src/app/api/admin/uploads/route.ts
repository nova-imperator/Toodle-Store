import { NextResponse } from "next/server";
import sharp from "sharp";
import { canAccess, getCurrentAdmin } from "@/server/auth/admin";
import { db } from "@/server/db";

// Product photo upload from the admin. The browser already shrinks big phone photos (Vercel accepts
// ~4.5 MB per request); here every image is re-encoded to webp, max 1600 px, which also strips EXIF/GPS.
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_SIDE = 1600;

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin || !canAccess(admin.role, "products")) return NextResponse.json({ error: { code: "unauthorized", message: "Log in again." } }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: { code: "no_file", message: "Choose a photo to upload." } }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: { code: "too_big", message: "That photo is too big. Please use one under 4 MB." } }, { status: 413 });

  try {
    // Upright first (phone EXIF rotation), then centre the whole photo on a white square so every product
    // photo has the same shape on cards and in the gallery – nothing cropped, nothing zoomed (owner, 28 Nov 2026).
    const upright = await sharp(Buffer.from(await file.arrayBuffer())).rotate().toBuffer({ resolveWithObject: true });
    const side = Math.min(MAX_SIDE, Math.max(upright.info.width, upright.info.height));
    const { data, info } = await sharp(upright.data)
      .resize(side, side, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: "#ffffff" })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const image = await db.mediaImage.create({ data: { data: new Uint8Array(data), width: info.width, height: info.height, size: info.size }, select: { id: true } });
    return NextResponse.json({ url: `/media/${image.id}.webp`, width: info.width, height: info.height });
  } catch {
    return NextResponse.json({ error: { code: "bad_image", message: "That file isn't a photo we can read. Try a JPG, PNG or WebP." } }, { status: 400 });
  }
}
