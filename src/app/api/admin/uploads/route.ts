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
    const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const image = await db.mediaImage.create({ data: { data: new Uint8Array(data), width: info.width, height: info.height, size: info.size }, select: { id: true } });
    return NextResponse.json({ url: `/media/${image.id}.webp`, width: info.width, height: info.height });
  } catch {
    return NextResponse.json({ error: { code: "bad_image", message: "That file isn't a photo we can read. Try a JPG, PNG or WebP." } }, { status: 400 });
  }
}
