import Image from "next/image";
import Link from "next/link";
import { BENEFITS, FAQS, SEGMENTS, STEPS, WHOLESALE_CATEGORIES } from "@/config/b2b";
import { SITE, WHATSAPP_BULK_HREF } from "@/config/site";
import { getCategoryPhotoOptions } from "@/server/services/catalogue";
import galleryJson from "@/config/b2b-gallery.json";

/** Written by scripts/build-b2b-images.mjs from the owner's godown photos. */
const B2B_GALLERY: { src: string; alt: string }[] = galleryJson;
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { EnquiryButton } from "./EnquiryButton";
import styles from "./B2BSections.module.css";

// Wholesale site look (owner, 17 Nov 2026): real product photos, no cartoon art, plain headings.
// Photos come from scripts/build-b2b-images.mjs (or the owner's own photos, see that script).
export const B2B_HERO_IMAGE = "/images/b2b/hero.webp";

export function B2BHero({
  title,
  text,
  source,
  image = B2B_HERO_IMAGE,
  imageAlt = "Toys we supply in bulk: learning laptops, plush toys, RC planes, dollhouses, blasters and writing tablets",
}: {
  title: string;
  text: string;
  source: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>For toy shops, resellers, schools and corporates</p>
          <h1>{title}</h1>
          <p className={styles.heroText}>{text}</p>
          <div className={styles.ctaRow}>
            <EnquiryButton label="Get the price list" source={source} />
            <a href={WHATSAPP_BULK_HREF} target="_blank" rel="noopener" className={styles.wa}>
              or WhatsApp {SITE.phone}
            </a>
          </div>
          <ul className={styles.facts}>
            <li>No minimum order</li>
            <li>GST invoice</li>
            <li>Delivery across India</li>
          </ul>
        </div>
        <Image src={image} alt={imageAlt} width={1200} height={900} sizes="(min-width: 900px) 46vw, 100vw" className={styles.heroArt} priority />
      </div>
    </section>
  );
}

/** Godown / bulk-stock photo gallery. Hidden until the owner's photos are added (see build-b2b-images.mjs). */
export function StockGallery() {
  if (B2B_GALLERY.length === 0) return null;
  return (
    <section className={`container ${styles.section}`} aria-labelledby="stock-h">
      <SectionHeading id="stock-h" title="Bulk stock, ready to ship" subtitle="Toys packed in cartons and dispatched across India." plain />
      <ul className={styles.gallery}>
        {B2B_GALLERY.map((g) => (
          <li key={g.src}>
            <Image src={g.src} alt={g.alt} width={1200} height={900} sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Segments() {
  return (
    <section id="who" className={`container ${styles.section}`} aria-labelledby="who-h">
      <SectionHeading id="who-h" title="Who we supply" plain />
      <ul className={styles.segments}>
        {SEGMENTS.map((s) => (
          <li key={s.slug}>
            <Link href={`/b2b/${s.slug}`} className={styles.segment}>
              <strong>{s.title}</strong>
              <span>{s.short}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Benefits() {
  return (
    <section className={styles.band} aria-labelledby="why-h">
      <div className="container">
        <SectionHeading id="why-h" title="Why businesses choose Toodle Store" plain />
        <ul className={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <li key={b.title}>
              <span className={styles.benefitNum}>{String(i + 1).padStart(2, "0")}</span>
              <strong>{b.title}</strong>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Photo cards for categories we have real product photos for (a different product on each card),
 * then the remaining categories as a plain list. No illustrations or placeholders.
 */
export async function WholesaleCategories() {
  const options = await getCategoryPhotoOptions();
  const used = new Set<string>();
  const withPhoto: { c: (typeof WHOLESALE_CATEGORIES)[number]; photo: { url: string; alt: string } }[] = [];
  const without: (typeof WHOLESALE_CATEGORIES)[number][] = [];
  for (const c of WHOLESALE_CATEGORIES) {
    const photo = options.get(c.slug)?.find((o) => !used.has(o.url));
    if (photo) {
      used.add(photo.url);
      withPhoto.push({ c, photo });
    } else without.push(c);
  }

  return (
    <section id="categories" className={`container ${styles.section}`} aria-labelledby="cat-h">
      <SectionHeading id="cat-h" title="Wholesale categories" subtitle="Mix any of these in one order. No minimum quantity or value." plain />
      <ul className={styles.cats}>
        {withPhoto.map(({ c, photo }) => (
          <li key={c.slug}>
            <Link href={`/b2b/${c.wholesaleSlug}`} className={styles.cat}>
              <Image src={photo.url} alt={photo.alt} width={400} height={400} sizes="(min-width: 1000px) 16vw, (min-width: 600px) 33vw, 50vw" />
              <span className={styles.catName}>{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {without.length > 0 && (
        <div className={styles.moreCats}>
          <span>Also available:</span>
          <ul>
            {without.map((c) => (
              <li key={c.slug}>
                <Link href={`/b2b/${c.wholesaleSlug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className={styles.note}>Full catalogue with wholesale prices on request. Ask for the categories you stock.</p>
    </section>
  );
}

export function Steps() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="how-h">
      <SectionHeading id="how-h" title="How bulk orders work" plain />
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <span className={styles.stepNum}>{i + 1}</span>
            <strong>{s.title}</strong>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq({ withLd = true }: { withLd?: boolean }) {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="faq-h">
      {withLd && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
      <SectionHeading id="faq-h" title="Questions businesses ask" plain />
      <div className={styles.faqs}>
        {FAQS.map((f) => (
          <details key={f.q} className={styles.faq}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CtaBand({ source }: { source: string }) {
  return (
    <section className={styles.cta}>
      <div className={`container ${styles.ctaInner}`}>
        <div className={styles.ctaCopy}>
          <h2>Ready to stock up?</h2>
          <p>Send a quick enquiry and get our wholesale price list within 24 hours.</p>
          <div className={styles.ctaRow}>
            <EnquiryButton label="Get the price list" source={source} />
            <a href={WHATSAPP_BULK_HREF} target="_blank" rel="noopener" className={styles.waBtn}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <Image src="/images/b2b/cta.webp" alt="" width={1200} height={400} sizes="(min-width: 900px) 50vw, 100vw" className={styles.ctaPhoto} />
      </div>
    </section>
  );
}
