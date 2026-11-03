import type { Metadata } from "next";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  return (
    <ListingView
      basePath="/search"
      title={q ? `Results for “${q}”` : "Search toys"}
      crumbs={[{ name: "Search", path: "/search" }]}
      fixed={{}}
      searchParams={sp}
    />
  );
}
