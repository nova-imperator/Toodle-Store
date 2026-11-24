import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { clientIp, rateLimit } from "@/server/http";

// First-party page-view counter for the admin dashboard. Stores a random visitor id (cookie), the path and
// the time – no names, emails or IP addresses. Bots and admin pages are ignored.
const VISITOR_COOKIE = "ts_vid";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|pingdom|monitor/i;

const schema = z.object({
  path: z.string().max(300).regex(/^\//),
  referrer: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  const ok = new NextResponse(null, { status: 204 });
  if (BOT.test(req.headers.get("user-agent") ?? "")) return ok;
  try {
    rateLimit(`track:${await clientIp()}`, 120, 60_000);
  } catch {
    return ok;
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return ok;
  const { path, referrer } = parsed.data;
  if (path.startsWith("/admin") || path.startsWith("/api")) return ok;

  const jar = await cookies();
  let visitorId = jar.get(VISITOR_COOKIE)?.value;
  if (!visitorId || visitorId.length > 64) {
    visitorId = randomUUID();
    jar.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 365 * 24 * 3600 });
  }

  const productSlug = path.match(/^\/product\/([^/?#]+)/)?.[1] ?? null;
  let ref: string | null = null;
  try {
    const host = referrer ? new URL(referrer).hostname : "";
    ref = host && !host.endsWith("toodlestore.in") && !host.includes("localhost") ? host.slice(0, 100) : null;
  } catch {
    ref = null;
  }

  await db.pageView.create({ data: { visitorId, path: path.split("?")[0].slice(0, 300), productSlug, site: path.startsWith("/b2b") ? "b2b" : "store", referrer: ref } });
  return ok;
}
