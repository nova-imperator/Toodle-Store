import Image from "next/image";
import Link from "next/link";
import { EnquiryButton } from "@/components/b2b/EnquiryButton";
import styles from "./B2BStrip.module.css";

export function B2BStrip() {
  return (
    <section className={styles.strip} aria-labelledby="b2b-strip">
      <div className={`container ${styles.inner}`}>
        <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.mascot} />
        <div className={styles.copy}>
          <h2 id="b2b-strip">Own a toy shop or starting one?</h2>
          <p>
            Stock up at wholesale prices across all 11 categories. No minimum order, GST invoice, free delivery across India.{" "}
            <Link href="/b2b">Learn more</Link>
          </p>
        </div>
        <EnquiryButton source="home-b2b-strip" />
      </div>
    </section>
  );
}
