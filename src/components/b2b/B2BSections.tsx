import Image from "next/image";
import Link from "next/link";
import { BENEFITS, FAQS, SEGMENTS, STEPS, WHOLESALE_CATEGORIES } from "@/config/b2b";
import { SITE } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { EnquiryButton } from "./EnquiryButton";
import styles from "./B2BSections.module.css";

export function B2BHero({ title, text, source, image = "/images/hero/b2b.webp" }: { title: string; text: string; source: string; image?: string }) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>For toy shops, resellers, schools and corporates</p>
          <h1>{title}</h1>
          <p className={styles.heroText}>{text}</p>
          <div className={styles.ctaRow}>
            <EnquiryButton label="Start now" source={source} />
            <a href={SITE.whatsappHref} className={styles.wa}>
              or WhatsApp {SITE.phone}
            </a>
          </div>
          <ul className={styles.facts}>
            <li>No minimum order</li>
            <li>GST invoice</li>
            <li>Free delivery across India</li>
          </ul>
        </div>
        <Image src={image} alt="" width={1000} height={760} className={styles.heroArt} priority />
      </div>
    </section>
  );
}

export function Segments() {
  return (
    <section id="who" className={`container ${styles.section}`} aria-labelledby="who-h">
      <SectionHeading id="who-h" title="Who we supply" />
      <ul className={styles.segments}>
        {SEGMENTS.map((s, i) => (
          <li key={s.slug}>
            <Link href={`/b2b/${s.slug}`} className={styles.segment} data-color={["red", "blue", "yellow", "green", "orange", "blue"][i]}>
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
        <SectionHeading id="why-h" title="Why businesses choose Toodle Store" />
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

export function WholesaleCategories() {
  return (
    <section id="categories" className={`container ${styles.section}`} aria-labelledby="cat-h">
      <SectionHeading id="cat-h" title="Wholesale categories" subtitle="Mix any of these in one order. No minimum quantity or value." />
      <ul className={styles.cats}>
        {WHOLESALE_CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link href={`/b2b/${c.wholesaleSlug}`} className={styles.cat}>
              <Image src={`/images/categories/${c.slug}.webp`} alt="" width={480} height={508} sizes="160px" />
              <span>{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Steps() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="how-h">
      <SectionHeading id="how-h" title="How bulk orders work" />
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
      <SectionHeading id="faq-h" title="Questions businesses ask" />
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
        <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.mascot} />
        <div>
          <h2>Ready to stock up?</h2>
          <p>Send a quick enquiry and get our wholesale price list within 24 hours.</p>
        </div>
        <div className={styles.ctaRow}>
          <EnquiryButton label="Start now" source={source} />
          <a href={SITE.whatsappHref} className={styles.waBtn}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
