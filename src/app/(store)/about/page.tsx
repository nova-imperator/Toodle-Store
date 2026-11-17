import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import styles from "@/components/content/Prose.module.css";

export const metadata: Metadata = pageSeo({
  title: "About Toodle Store",
  description: "Toodle Store brings toys for every age to families across India: learning toys, RC vehicles, dollhouses and gifts, with online payment or cash on delivery.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <ContentPage title="About Toodle Store" path="/about">
      <p>
        <strong>{SITE.tagline}</strong> That&apos;s the idea behind Toodle Store. We believe a good toy shouldn&apos;t depend on how big the budget is,
        so our range goes from small everyday toys all the way up to big birthday surprises.
      </p>
      <p>
        We stock eleven kinds of toys, from action figures and RC cars to soft toys, puzzles and musical instruments, and we sort them by age so
        it&apos;s easy to find the right one for a baby, a preschooler or a pre-teen.
      </p>
      <figure className={styles.figure}>
        <Image src="/images/brand/store-banner.webp" alt="Toodle Store banner showing our toy categories and contact number" width={900} height={1200} />
      </figure>
      <h2>How we work</h2>
      <ul>
        <li>Delivery anywhere in India: ₹100 per order, free on orders of ₹2,000 or more.</li>
        <li>Pay securely online with UPI, cards, netbanking or wallets through Razorpay.</li>
        <li>Real people answer on WhatsApp at {SITE.phone}.</li>
      </ul>
      <h2>For businesses</h2>
      <p>
        We also supply toy shops, online sellers, schools and companies at wholesale prices with no minimum order.{" "}
        <Link href="/b2b">See our wholesale service</Link>.
      </p>
    </ContentPage>
  );
}
