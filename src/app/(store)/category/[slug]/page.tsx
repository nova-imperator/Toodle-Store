import type { Metadata } from "next";
import Image from "next/image";
import { getCategoryBySlug } from "@/server/services/catalogue";
import { redirectOrNotFound } from "@/server/services/redirects";
import { ListingView } from "@/components/product/ListingView";
import type { SearchParams } from "@/lib/listingParams";
import styles from "../../listing.module.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) return {};
  return {
    title: category.seoTitle ?? `${category.name} for Kids`,
    description: category.seoDescription ?? undefined,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return redirectOrNotFound(`/category/${slug}`);

  return (
    <ListingView
      basePath={`/category/${category.slug}`}
      title={category.name}
      intro={category.description}
      color={category.color}
      crumbs={[{ name: category.name, path: `/category/${category.slug}` }]}
      fixed={{ category: category.slug }}
      searchParams={await searchParams}
      aside={
        category.image && (
          <Image src={category.image} alt="" width={480} height={508} className={styles.aside} priority />
        )
      }
    />
  );
}
