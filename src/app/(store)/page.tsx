import { getHomeData, getRecentReviews } from "@/server/services/catalogue";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { AgeTiles } from "@/components/home/AgeTiles";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { BrandStrip } from "@/components/home/BrandStrip";
import { GiftFinder } from "@/components/home/GiftFinder";
import { B2BStrip } from "@/components/home/B2BStrip";
import { TrustBar } from "@/components/home/TrustBar";
import { Reviews } from "@/components/home/Reviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/structuredData";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [home, reviews] = await Promise.all([getHomeData(), getRecentReviews()]);

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <h1 className="visually-hidden">Toodle Store: buy toys online in India</h1>
      <HeroSlider slides={home.banners} />

      <div className={`container ${styles.trust}`}>
        <TrustBar />
      </div>

      <section className={`container ${styles.section}`} aria-labelledby="cat-h">
        <SectionHeading id="cat-h" title="Shop by category" subtitle="Eleven aisles of fun, all in one place." />
        <CategoryTiles categories={home.categories} />
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="age-h">
        <SectionHeading id="age-h" title="Shop by age" subtitle="The right toy for every stage." />
        <AgeTiles />
      </section>

      {home.bestSellers.length > 0 && (
        <section className={`container ${styles.section}`} aria-labelledby="best-h">
          <SectionHeading id="best-h" title="Best sellers" action={{ label: "See all", href: "/shop?flag=best" }} />
          <ProductCarousel products={home.bestSellers} label="Best sellers" />
        </section>
      )}

      {home.deals.length > 0 && (
        <section className={`${styles.band} ${styles.section}`} aria-labelledby="deal-h">
          <div className="container">
            <SectionHeading id="deal-h" title="Deals of the week" subtitle="Big smiles, smaller prices." action={{ label: "All offers", href: "/shop?flag=deal" }} />
            <ProductCarousel products={home.deals} label="Deals" />
          </div>
        </section>
      )}

      <section className={`container ${styles.section}`} aria-labelledby="gift-h">
        <SectionHeading id="gift-h" title="Gift finder" subtitle="Two taps to the perfect birthday present." />
        <GiftFinder />
      </section>

      {home.newArrivals.length > 0 && (
        <section className={`container ${styles.section}`} aria-labelledby="new-h">
          <SectionHeading id="new-h" title="New arrivals" action={{ label: "See all", href: "/shop?flag=new" }} />
          <ProductCarousel products={home.newArrivals} label="New arrivals" />
        </section>
      )}

      <section className={`container ${styles.section}`} aria-labelledby="brand-h">
        <SectionHeading id="brand-h" title="Brands we stock" action={{ label: "All brands", href: "/brands" }} />
        <BrandStrip brands={home.brands} />
      </section>

      <div className={styles.section}>
        <B2BStrip />
      </div>

      <section className={`container ${styles.section}`} aria-labelledby="rev-h">
        <SectionHeading id="rev-h" title="From Toodle families" />
        <Reviews reviews={reviews} />
      </section>
    </>
  );
}
