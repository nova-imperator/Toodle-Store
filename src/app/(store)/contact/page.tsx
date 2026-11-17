import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE, WHATSAPP_RETAIL_HREF } from "@/config/site";
import styles from "@/components/content/Prose.module.css";

export const metadata: Metadata = pageSeo({
  title: "Contact Us",
  description: "Call or WhatsApp Toodle Store on +91 99878 83903, or email toodlestoreindia@gmail.com. We're happy to help you choose a toy or track an order.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <ContentPage title="Contact us" path="/contact">
      <p>Questions about a toy, an order or a gift idea? Reach us any of these ways.</p>
      <ul className={styles.cards}>
        <li>
          <strong>WhatsApp</strong>
          <a href={WHATSAPP_RETAIL_HREF} target="_blank" rel="noopener">{SITE.phone}</a>
          <br />Fastest way to reach us.
        </li>
        <li>
          <strong>Phone</strong>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </li>
        <li>
          <strong>Email</strong>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </li>
        <li>
          <strong>Instagram</strong>
          <a href={SITE.instagramHref} target="_blank" rel="noopener">
            {SITE.instagram}
          </a>
        </li>
        <li>
          <strong>Facebook</strong>
          <a href={SITE.facebookHref} target="_blank" rel="noopener">
            Toodle Store on Facebook
          </a>
        </li>
      </ul>
      <p>
        Have an order? Find its status in <Link href="/account/orders">My orders</Link>. Buying for a shop, school or event?{" "}
        <Link href="/b2b/enquiry">Send a wholesale enquiry</Link>.
      </p>
    </ContentPage>
  );
}
