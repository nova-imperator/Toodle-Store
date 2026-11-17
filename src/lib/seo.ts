import type { Metadata } from "next";
import { SITE } from "@/config/site";

/** Social share images (1200×630), built by scripts/build-b2b-images.mjs from real product photos. */
export const OG_IMAGE = { store: "/images/og/store.jpg", b2b: "/images/og/b2b.jpg" } as const;

interface PageSeo {
  /** Page title; the layout template adds " | Toodle Store". Use `absolute` for a full custom title. */
  title: string | { absolute: string };
  description: string;
  /** Canonical path, e.g. "/category/fun-games". */
  path: string;
  /** Share image path or absolute URL (defaults to the store or wholesale share image). */
  image?: string;
  imageAlt?: string;
  site?: keyof typeof OG_IMAGE;
  type?: "website" | "article";
}

/**
 * Default SEO for a public page: title, meta description, canonical URL, and matching
 * Open Graph + Twitter card (Next.js replaces, not merges, openGraph per page, so each page sets all of it).
 */
export function pageSeo({ title, description, path, image, imageAlt, site = "store", type = "website" }: PageSeo): Metadata {
  const shareTitle = typeof title === "string" ? `${title} | ${SITE.name}` : title.absolute;
  const desc = description.length > 160 ? `${description.slice(0, 157).trimEnd()}…` : description;
  const img = { url: image ?? OG_IMAGE[site], alt: imageAlt ?? `${SITE.name}${site === "b2b" ? " wholesale toys" : " – toys online in India"}` };
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE.name, locale: "en_IN", url: path, title: shareTitle, description: desc, images: [img] },
    twitter: { card: "summary_large_image", title: shareTitle, description: desc, images: [img.url] },
  };
}
