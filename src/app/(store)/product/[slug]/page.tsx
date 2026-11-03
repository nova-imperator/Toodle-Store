import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug } from "@/server/services/catalogue";
import { redirectOrNotFound } from "@/server/services/redirects";
import { BuyBox } from "@/components/product/BuyBox";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { JsonLd } from "@/components/seo/JsonLd";
import { productLd } from "@/lib/structuredData";
import { SITE } from "@/config/site";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProductBySlug((await params).slug);
  if (!data) return {};
  const { product } = data;
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description.slice(0, 155),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { images: product.images.slice(0, 1).map((i) => i.url) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return redirectOrNotFound(`/product/${slug}`);
  const { product, related } = data;

  const primary = product.categories[0]?.category;
  const inStock = product.stockQty > 0;
  const reviews = product.reviews;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const faqs = [
    { q: "How long will delivery take?", a: `Most orders reach you in ${SITE.deliveryDays.min}–${SITE.deliveryDays.max} working days, anywhere in India. Delivery is always free.` },
    { q: "Can I pay cash on delivery?", a: "Yes. Choose cash on delivery at checkout and our team will call you to confirm the order before it ships." },
    { q: "Can I return this toy?", a: "We don't offer returns or refunds, so please check the age range and size before ordering. If anything is wrong with your order, WhatsApp us and we'll help." },
    { q: "Is it safe for my child?", a: product.safetyInfo ?? "Please follow the age guidance on this page." },
  ];

  return (
    <div className="container" data-color={primary?.color ?? "blue"}>
      <JsonLd
        data={productLd({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          images: product.images.map((i) => i.url),
          brand: product.brand?.name ?? null,
          salePrice: product.salePrice,
          inStock,
          rating: { value: avg, count: reviews.length },
        })}
      />
      <Breadcrumbs
        items={[
          ...(primary ? [{ name: primary.name, path: `/category/${primary.slug}` }] : []),
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />

      <div className={styles.top}>
        <BuyBox productId={product.id} name={product.name} salePrice={product.salePrice} inStock={inStock} images={product.images}>
          {product.brand && (
            <Link href={`/brand/${product.brand.slug}`} className={styles.brand}>
              {product.brand.name}
            </Link>
          )}
          <h1 className={styles.title}>{product.name}</h1>
          {reviews.length > 0 && (
            <a href="#reviews" className={styles.rating}>
              <Stars rating={avg} /> {avg.toFixed(1)} ({reviews.length})
            </a>
          )}
          <div className={styles.ages}>
            {product.ageGroups.map(({ ageGroup }) => (
              <Link key={ageGroup.id} href={`/age/${ageGroup.slug}`} data-color={ageGroup.color} className={styles.age}>
                {ageGroup.name}
              </Link>
            ))}
          </div>
          <div>
            <Price mrp={product.mrp} sale={product.salePrice} size="lg" />
            <p className={styles.tax}>Inclusive of all taxes · Free delivery</p>
          </div>
          <p className={inStock ? (product.stockQty <= 5 ? styles.low : styles.stock) : styles.out}>
            {inStock ? (product.stockQty <= 5 ? `Hurry, only ${product.stockQty} left` : "In stock, ready to ship") : "Sold out for now"}
          </p>
          {product.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {product.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <DeliveryCheck />
        </BuyBox>
      </div>

      <div className={styles.details}>
        <section aria-labelledby="about-h">
          <SectionHeading id="about-h" title="About this toy" />
          <p className={styles.desc}>{product.description}</p>
          <dl className={styles.specs}>
            {product.material && (
              <div>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
            )}
            {product.dimensions && (
              <div>
                <dt>Size</dt>
                <dd>{product.dimensions}</dd>
              </div>
            )}
            <div>
              <dt>Age</dt>
              <dd>{product.ageGroups.map((a) => a.ageGroup.name).join(", ")}</dd>
            </div>
            {product.safetyInfo && (
              <div>
                <dt>Safety</dt>
                <dd>{product.safetyInfo}</dd>
              </div>
            )}
            <div>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="faq-h">
          <SectionHeading id="faq-h" title="Questions parents ask" />
          <div className={styles.faqs}>
            {faqs.map((f) => (
              <details key={f.q} className={styles.faq}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section id="reviews" className={styles.section} aria-labelledby="rev-h">
        <SectionHeading id="rev-h" title="Reviews" />
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Bought this toy? You can review it from My Orders after delivery.</p>
        ) : (
          <ul className={styles.reviews}>
            {reviews.map((r) => (
              <li key={r.id}>
                <Stars rating={r.rating} />
                {r.comment && <p>{r.comment}</p>}
                <small>{r.user.name?.split(" ")[0] ?? "Verified buyer"}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className={styles.section} aria-labelledby="rel-h">
          <SectionHeading id="rel-h" title="You might also like" />
          <ProductCarousel products={related} label="Related toys" />
        </section>
      )}
    </div>
  );
}
