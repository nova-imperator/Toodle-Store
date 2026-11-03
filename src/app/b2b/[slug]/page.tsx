import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEGMENTS, WHOLESALE_CATEGORIES } from "@/config/b2b";
import { B2BHero, Benefits, CtaBand, Faq, Steps, WholesaleCategories } from "@/components/b2b/B2BSections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import styles from "../b2b.module.css";

type Props = { params: Promise<{ slug: string }> };

function resolve(slug: string) {
  const category = WHOLESALE_CATEGORIES.find((c) => c.wholesaleSlug === slug);
  if (category) {
    return {
      kind: "category" as const,
      name: category.name,
      title: `Wholesale ${category.name} Supplier in India`,
      h1: `Wholesale ${category.name.toLowerCase()} for your business`,
      text: `${category.intro} Order in bulk at trade prices, mix with any other category, and get a GST invoice with free delivery across India.`,
      image: `/images/categories/${category.slug}.webp`,
    };
  }
  const segment = SEGMENTS.find((s) => s.slug === slug);
  if (segment) {
    return { kind: "segment" as const, name: segment.title, title: `Bulk Toys for ${segment.title}`, h1: `Toys in bulk for ${segment.title.toLowerCase()}`, text: `${segment.short} ${segment.body}`, image: undefined };
  }
  return null;
}

export function generateStaticParams() {
  return [...WHOLESALE_CATEGORIES.map((c) => ({ slug: c.wholesaleSlug })), ...SEGMENTS.map((s) => ({ slug: s.slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) return {};
  return { title: `${page.title} – Bulk Orders`, description: page.text.slice(0, 155), alternates: { canonical: `/b2b/${slug}` } };
}

export default async function B2BDetail({ params }: Props) {
  const { slug } = await params;
  const page = resolve(slug);
  if (!page) notFound();

  return (
    <>
      <B2BHero title={page.h1} text={page.text} source={`b2b-${slug}`} image={page.image} />
      <div className={`container ${styles.crumbs}`}>
        <Breadcrumbs items={[{ name: "Wholesale", path: "/b2b" }, { name: page.name, path: `/b2b/${slug}` }]} />
      </div>
      <Benefits />
      <Steps />
      {page.kind === "segment" && <WholesaleCategories />}
      <Faq />
      <CtaBand source={`b2b-${slug}-cta`} />
    </>
  );
}
