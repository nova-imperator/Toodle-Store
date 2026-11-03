import type { Metadata } from "next";
import { getAllBrands } from "@/server/services/catalogue";
import { BrandStrip } from "@/components/home/BrandStrip";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "../listing.module.css";

export const metadata: Metadata = { title: "Toy Brands", alternates: { canonical: "/brands" } };

export default async function BrandsPage() {
  const brands = await getAllBrands();
  return (
    <div className="container">
      <Breadcrumbs items={[{ name: "Brands", path: "/brands" }]} />
      <div className={styles.pageHead}>
        <SectionHeading as="h1" title="Brands we stock" subtitle={`${brands.length} brands, all delivered free across India.`} />
        <BrandStrip brands={brands} />
      </div>
    </div>
  );
}
