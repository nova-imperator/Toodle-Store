import "server-only";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";

const normalise = (path: string) => {
  const p = path.trim().replace(/^https?:\/\/[^/]+/i, "");
  return p.length > 1 ? p.replace(/\/+$/, "") : p || "/";
};

/** 301s an old WordPress URL to its new home if one is mapped, otherwise shows the 404 page. */
export async function redirectOrNotFound(path: string): Promise<never> {
  const clean = normalise(path);
  const match = await db.redirect.findFirst({ where: { oldUrl: { in: [clean, `${clean}/`] } } });
  if (match) permanentRedirect(match.newUrl);
  notFound();
}

export const listRedirects = () => db.redirect.findMany({ orderBy: { oldUrl: "asc" } });

export async function addRedirect(oldUrl: string, newUrl: string) {
  const from = normalise(oldUrl);
  const to = normalise(newUrl);
  if (!from.startsWith("/") || !to.startsWith("/")) throw new AppError("bad_url", "Both URLs must be paths on this site, like /old-page.");
  if (from === to) throw new AppError("loop", "The old and new URL are the same.");
  await db.redirect.upsert({ where: { oldUrl: from }, update: { newUrl: to }, create: { oldUrl: from, newUrl: to } });
}

export const deleteRedirect = (oldUrl: string) => db.redirect.delete({ where: { oldUrl } });
