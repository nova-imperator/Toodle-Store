import { sitemapIndex } from "@/server/services/sitemap";

export async function GET() {
  return new Response(sitemapIndex(["sitemap-b2c.xml", "sitemap-b2b.xml"]), { headers: { "Content-Type": "application/xml" } });
}
