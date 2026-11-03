import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { EnquiryButton } from "./EnquiryButton";
import styles from "./B2BHeader.module.css";

const LINKS = [
  { href: "/b2b#who", label: "Who we supply" },
  { href: "/b2b#categories", label: "Categories" },
  { href: "/b2b/how-it-works", label: "How it works" },
  { href: "/b2b/faq", label: "FAQ" },
];

export function B2BHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/b2b" className={styles.brand} aria-label="Toodle Store for business">
          <Image src="/images/brand/logo.webp" alt="Toodle Store" width={520} height={489} className={styles.logo} priority />
          <span className={styles.tag}>Wholesale</span>
        </Link>
        <nav className={styles.nav} aria-label="Business">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <a href={SITE.whatsappHref} className={styles.wa}>
            WhatsApp
          </a>
          <EnquiryButton label="Enquire" size="md" source="b2b-header" />
        </div>
      </div>
      <div className={styles.retail}>
        <div className="container">
          Shopping for your own child? <Link href="/">Visit the Toodle toy store</Link>
        </div>
      </div>
    </header>
  );
}
