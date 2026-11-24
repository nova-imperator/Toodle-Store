import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";

const FLAG_TITLES: Record<string, string> = { best: "Best sellers", new: "New arrivals", deal: "Offers and deals" };

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const flag = (await searchParams).flag as string | undefined;
  const title = (flag && FLAG_TITLES[flag]) || "All Toys – Buy Toys Online in India";
  const path = flag && FLAG_TITLES[flag] ? `/shop?flag=${flag}` : "/shop";
  return pageSeo({
    title,
    description: `${flag && FLAG_TITLES[flag] ? FLAG_TITLES[flag] : "All toys"} at Toodle Store: learning toys, RC vehicles, dollhouses, soft toys and gifts. Delivery across India, free on orders of ₹999+.`,
    path,
  });
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const flag = typeof sp.flag === "string" ? sp.flag : undefined;
  const title = (flag && FLAG_TITLES[flag]) || "All toys";
  return (
    <ListingView
      basePath="/shop"
      title={title}
      intro="Every toy in the Toodle Store, from first learning toys to big birthday surprises. Free delivery on orders of ₹999+."
      color={flag === "deal" ? "orange" : "blue"}
      crumbs={[{ name: title, path: "/shop" }]}
      fixed={{}}
      searchParams={sp}
    />
  );
}
