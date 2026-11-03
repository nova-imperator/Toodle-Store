import "server-only";
import { db } from "@/server/db";
import { SITE } from "@/config/site";
import { SEGMENTS, WHOLESALE_CATEGORIES } from "@/config/b2b";

interface Entry {
  path: string;
  lastmod?: Date;
  priority?: number;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function urlset(entries: Entry[]) {
  const body = entries
    .map((e) => `<url><loc>${esc(SITE.url + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ""}${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function sitemapIndex(files: string[]) {
  const body = files.map((f) => `<sitemap><loc>${esc(`${SITE.url}/${f}`)}</loc></sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

export async function b2cEntries(): Promise<Entry[]> {
  const [products, categories, ages, brands] = await Promise.all([
    db.product.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
    db.category.findMany({ select: { slug: true } }),
    db.ageGroup.findMany({ select: { slug: true } }),
    db.brand.findMany({ select: { slug: true } }),
  ]);
  return [
    { path: "/", priority: 1 },
    { path: "/shop", priority: 0.8 },
    ...categories.map((c) => ({ path: `/category/${c.slug}`, priority: 0.9 })),
    ...ages.map((a) => ({ path: `/age/${a.slug}`, priority: 0.8 })),
    { path: "/brands", priority: 0.5 },
    ...brands.map((b) => ({ path: `/brand/${b.slug}`, priority: 0.6 })),
    ...products.map((p) => ({ path: `/product/${p.slug}`, lastmod: p.updatedAt, priority: 0.7 })),
    ...["/about", "/contact", "/shipping-policy", "/return-policy", "/privacy-policy", "/terms"].map((path) => ({ path, priority: 0.3 })),
  ];
}

export function b2bEntries(): Entry[] {
  return [
    { path: "/b2b", priority: 1 },
    { path: "/b2b/enquiry", priority: 0.8 },
    { path: "/b2b/how-it-works", priority: 0.6 },
    { path: "/b2b/faq", priority: 0.6 },
    ...WHOLESALE_CATEGORIES.map((c) => ({ path: `/b2b/${c.wholesaleSlug}`, priority: 0.8 })),
    ...SEGMENTS.map((s) => ({ path: `/b2b/${s.slug}`, priority: 0.8 })),
  ];
}
