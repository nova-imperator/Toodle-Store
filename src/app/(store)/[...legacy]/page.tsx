import { redirectOrNotFound } from "@/server/services/redirects";

/** Old WordPress URLs: 301 to their new home when listed in the redirects table, otherwise 404. */
export default async function LegacyPage({ params }: { params: Promise<{ legacy: string[] }> }) {
  const { legacy } = await params;
  return redirectOrNotFound(`/${legacy.map(decodeURIComponent).join("/")}`);
}
