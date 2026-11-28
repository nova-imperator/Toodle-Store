// Product videos (owner, 28 Nov 2026): uploaded video files (Vercel Blob URLs: .mp4 / .webm / .mov),
// or a YouTube link (watch, youtu.be, shorts) for products saved before uploads existed.

export type ProductVideo = { kind: "youtube"; id: string } | { kind: "file"; src: string };

export function parseVideo(url: string | null | undefined): ProductVideo | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1] ?? null;
  }
  if (id && /^[\w-]{6,20}$/.test(id)) return { kind: "youtube", id };
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", src: u.toString() };
  return null;
}
