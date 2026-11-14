import Link from "next/link";
import { SITE, WHATSAPP_BULK_HREF } from "@/config/site";
import { DELIVERY_REGION_NOTE } from "@/config/shipping";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Icon } from "@/components/ui/Icon";
import { EnquiryButton } from "./EnquiryButton";
import header from "@/components/layout/Header.module.css";
import styles from "./B2BHeader.module.css";

const LINKS = [
  { href: "/b2b#who", label: "Who we supply" },
  { href: "/b2b#categories", label: "Wholesale categories" },
  { href: "/b2b/how-it-works", label: "How it works" },
  { href: "/b2b/faq", label: "FAQ" },
  { href: "/b2b/enquiry", label: "Send an enquiry" },
];

/** Same structure and look as the store header: yellow strip, logo bar, link row. */
export function B2BHeader() {
  return (
    <header className={header.header}>
      <div className={header.strip}>
        <div className={`container ${header.stripInner}`}>
          <span>Wholesale toys for shops, schools &amp; resellers · No minimum order · {DELIVERY_REGION_NOTE.title}</span>
          <span className={header.desk}>
            Questions? WhatsApp <a href={WHATSAPP_BULK_HREF} target="_blank" rel="noopener">{SITE.phone}</a>
          </span>
        </div>
      </div>

      <div className={`container ${styles.bar}`}>
        <SiteLogo href="/b2b" className={`${header.logo} ${styles.logo}`} label="Toodle Store wholesale home" />

        {/* Retail / Wholesale switch: this site is the wholesale side. */}
        <nav className={styles.switch} aria-label="Switch store">
          <Link href="/">
            <Icon name="cart" size={16} /> Retail store
          </Link>
          <span aria-current="page">
            <Icon name="box" size={16} /> Wholesale
          </span>
        </nav>

        <div className={styles.cta}>
          <EnquiryButton
            label={
              <>
                <span className={styles.ctaLong}>Get a Quick, Free Quote</span>
                <span className={styles.ctaShort}>Free Quote</span>
              </>
            }
            variant="red"
            size="md"
            source="b2b-header"
          />
        </div>
      </div>

      <nav className={`${header.cats} ${styles.links}`} aria-label="Wholesale">
        <div className={`container ${header.catsInner}`}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
