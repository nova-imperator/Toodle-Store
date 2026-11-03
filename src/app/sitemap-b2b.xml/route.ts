import { b2bEntries, urlset } from "@/server/services/sitemap";

export async function GET() {
  return new Response(urlset(b2bEntries()), { headers: { "Content-Type": "application/xml" } });
}
