import Image from "next/image";
import Link from "next/link";
import { SITE, POLICY_LINKS } from "@/config/site";
import { CATEGORY_LINKS, AGE_LINKS } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.studs} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image src="/images/brand/logo.webp" alt={SITE.name} width={520} height={489} className={styles.logo} />
          <p className={styles.tagline}>{SITE.tagline}</p>
          <ul className={styles.contact}>
            <li>
              <a href={SITE.phoneHref}>
                <Icon name="phone" size={18} /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappHref}>
                <Icon name="whatsapp" size={18} /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.instagramHref} rel="noopener" target="_blank">
                <Icon name="instagram" size={18} /> {SITE.instagram}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>
                <Icon name="mail" size={18} /> {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Categories">
          <h2 className={styles.head}>Categories</h2>
          <ul className={styles.links}>
            {CATEGORY_LINKS.map((c) => (
              <li key={c.href}>
                <Link href={c.href}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ages and help">
          <h2 className={styles.head}>Shop by age</h2>
          <ul className={styles.links}>
            {AGE_LINKS.map((a) => (
              <li key={a.href}>
                <Link href={a.href}>{a.label}</Link>
              </li>
            ))}
          </ul>
          <h2 className={`${styles.head} ${styles.spaced}`}>Help</h2>
          <ul className={styles.links}>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/account/orders">Track my order</Link></li>
          </ul>
        </nav>

        <nav aria-label="Business">
          <h2 className={styles.head}>For business</h2>
          <ul className={styles.links}>
            <li><Link href="/b2b">Wholesale toys</Link></li>
            <li><Link href="/b2b/how-it-works">How bulk orders work</Link></li>
            <li><Link href="/b2b/enquiry">Send an enquiry</Link></li>
            <li><Link href="/b2b/faq">Business FAQ</Link></li>
          </ul>
          <h2 className={`${styles.head} ${styles.spaced}`}>Policies</h2>
          <ul className={styles.links}>
            {POLICY_LINKS.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`container ${styles.legal}`}>
        <p>
          © {new Date().getFullYear()} {SITE.name}, operated by {SITE.legalName}. Prices include GST. Payments secured by Razorpay.
        </p>
      </div>
    </footer>
  );
}
