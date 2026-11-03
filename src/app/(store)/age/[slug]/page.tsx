import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAgeGroupBySlug } from "@/server/services/catalogue";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";
import styles from "../../listing.module.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const age = await getAgeGroupBySlug((await params).slug);
  if (!age) return {};
  return {
    title: age.seoTitle ?? `Toys for ${age.name}`,
    description: age.seoDescription ?? undefined,
    alternates: { canonical: `/age/${age.slug}` },
  };
}

export default async function AgePage({ params, searchParams }: Props) {
  const age = await getAgeGroupBySlug((await params).slug);
  if (!age) notFound();

  return (
    <ListingView
      basePath={`/age/${age.slug}`}
      title={`Toys for ${age.name}`}
      intro={age.description}
      color={age.color}
      crumbs={[{ name: `Toys for ${age.name}`, path: `/age/${age.slug}` }]}
      fixed={{ age: age.slug }}
      hide={["ages"]}
      searchParams={await searchParams}
      aside={<Image src={`/images/ages/${age.slug}.webp`} alt="" width={400} height={400} className={styles.aside} priority />}
    />
  );
}
