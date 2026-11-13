import type { Metadata } from "next";
import { getCurrentUser } from "@/server/auth/session";
import { TrackOrder } from "@/components/order/TrackOrder";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Track My Order",
  description: "Track your Toodle Store order with your order number and email.",
  alternates: { canonical: "/track-order" },
  robots: { index: false, follow: true },
};

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [{ order }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const initialOrder = (order ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);

  return (
    <div className={styles.page}>
      <section className={styles.band}>
        <div className="container">
          <p className={styles.eyebrow}>Order tracking</p>
          <h1>Where&apos;s my toy?</h1>
          <p className={styles.lead}>Enter your order number and email to see where your order is and when to expect it.</p>
        </div>
      </section>
      <div className={`container ${styles.body}`}>
        <TrackOrder initialOrder={initialOrder} signedIn={!!user} />
      </div>
    </div>
  );
}
