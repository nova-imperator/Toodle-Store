import { b2cEntries, urlset } from "@/server/services/sitemap";

export const revalidate = 3600;

export async function GET() {
  return new Response(urlset(await b2cEntries()), { headers: { "Content-Type": "application/xml" } });
}
