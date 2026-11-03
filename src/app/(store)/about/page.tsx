import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentPage } from "@/components/content/Prose";
import { SITE } from "@/config/site";
import styles from "@/components/content/Prose.module.css";

export const metadata: Metadata = {
  title: "About Toodle Store",
  description: "Toodle Store brings toys for every age to families across India, starting at ₹49, with free delivery on every order.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ContentPage title="About Toodle Store" path="/about">
      <p>
        <strong>{SITE.tagline}</strong> That&apos;s the idea behind Toodle Store. We believe a good toy shouldn&apos;t depend on how big the budget is,
        so our range starts at ₹49 and goes all the way up to big birthday surprises.
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
        <li>Free delivery on every order, anywhere in India.</li>
        <li>Pay online with UPI, cards or netbanking through Razorpay, or choose cash on delivery and we&apos;ll call to confirm.</li>
        <li>Real people answer on WhatsApp at {SITE.phone}.</li>
      </ul>
      <h2>For businesses</h2>
      <p>
        We also supply toy shops, online sellers, schools and companies at wholesale prices with no minimum order.{" "}
        <Link href="/b2b">See our wholesale service</Link>.
      </p>
      <p>Toodle Store is operated by {SITE.legalName}.</p>
    </ContentPage>
  );
}
