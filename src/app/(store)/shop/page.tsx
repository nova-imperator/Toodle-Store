import type { Metadata } from "next";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";

const FLAG_TITLES: Record<string, string> = { best: "Best sellers", new: "New arrivals", deal: "Offers and deals" };

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const flag = (await searchParams).flag as string | undefined;
  const title = (flag && FLAG_TITLES[flag]) || "All Toys – Buy Toys Online in India";
  return { title, alternates: { canonical: "/shop" } };
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const flag = typeof sp.flag === "string" ? sp.flag : undefined;
  const title = (flag && FLAG_TITLES[flag]) || "All toys";
  return (
    <ListingView
      basePath="/shop"
      title={title}
      intro="Every toy in the Toodle Store, from ₹49 pocket-money picks to big birthday surprises. Free delivery across India."
      color={flag === "deal" ? "orange" : "blue"}
      crumbs={[{ name: title, path: "/shop" }]}
      fixed={{}}
      searchParams={sp}
    />
  );
}
