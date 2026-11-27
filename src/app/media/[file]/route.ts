import { db } from "@/server/db";

/** Serves admin-uploaded product photos (/media/<id>.webp). Images never change, so they're cached for a year. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const id = (await params).file.replace(/\.webp$/, "");
  if (!/^[a-z0-9]{10,40}$/.test(id)) return new Response("Not found", { status: 404 });
  const image = await db.mediaImage.findUnique({ where: { id }, select: { data: true, mimeType: true } });
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: { "Content-Type": image.mimeType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
