import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/server/services/catalogue";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrandBySlug((await params).slug);
  if (!brand) return {};
  return { title: `${brand.name} Toys – Buy Online`, alternates: { canonical: `/brand/${brand.slug}` } };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const brand = await getBrandBySlug((await params).slug);
  if (!brand) notFound();

  return (
    <ListingView
      basePath={`/brand/${brand.slug}`}
      title={`${brand.name} toys`}
      intro={brand.description}
      crumbs={[
        { name: "Brands", path: "/brands" },
        { name: brand.name, path: `/brand/${brand.slug}` },
      ]}
      fixed={{ brand: brand.slug }}
      hide={["brands"]}
      searchParams={await searchParams}
    />
  );
}
