import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { canAccess, getCurrentAdmin } from "@/server/auth/admin";

// Product video upload (owner, 28 Nov 2026: "upload video, not a link"). Videos are far bigger than
// Vercel's ~4.5 MB request limit, so the browser uploads straight to Vercel Blob storage; this route only
// checks the admin and issues a short-lived upload permission. Needs a Blob store connected to the project
// (Vercel → Storage → Blob), which sets BLOB_READ_WRITE_TOKEN.
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_BYTES = 100 * 1024 * 1024;

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Video uploads aren't switched on yet: connect a Blob store in Vercel (Storage → Blob)." }, { status: 503 });
  }
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const admin = await getCurrentAdmin();
        if (!admin || !canAccess(admin.role, "products")) throw new Error("Log in to the admin again.");
        if (!pathname.startsWith("product-videos/")) throw new Error("Invalid upload.");
        return { allowedContentTypes: VIDEO_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
