import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import styles from "@/components/content/Prose.module.css";

export const metadata: Metadata = { title: "Contact Us", description: "Call or WhatsApp Toodle Store, or email us. We're happy to help you choose a toy.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <ContentPage title="Contact us" path="/contact">
      <p>Questions about a toy, an order or a gift idea? Reach us any of these ways.</p>
      <ul className={styles.cards}>
        <li>
          <strong>WhatsApp</strong>
          <a href={SITE.whatsappHref}>{SITE.phone}</a>
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
      </ul>
      <p>
        Have an order? Find its status in <Link href="/account/orders">My orders</Link>. Buying for a shop, school or event?{" "}
        <Link href="/b2b/enquiry">Send a wholesale enquiry</Link>.
      </p>
    </ContentPage>
  );
}
