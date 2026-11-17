import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Staging and local builds must never be indexed.
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is NOT listed on purpose: Google must be able to fetch it to see its "noindex"
      // (meta tag + X-Robots-Tag header). A robots.txt block alone can still leave the URL in results.
      disallow: ["/api/", "/cart", "/checkout", "/account", "/order/", "/login", "/search"],
    },
    sitemap: `${SITE.url}/sitemap_index.xml`,
  };
}
