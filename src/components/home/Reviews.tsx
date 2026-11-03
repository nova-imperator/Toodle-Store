import Link from "next/link";
import { SITE } from "@/config/site";
import { Stars } from "@/components/ui/Stars";
import styles from "./Reviews.module.css";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  author: string;
  productName: string;
  productSlug: string;
}

/** Only approved customer reviews are shown. Until there are some, invite shoppers to share instead. */
export function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <div className={styles.invite}>
        <p className={styles.inviteTitle}>Got a Toodle toy at home?</p>
        <p>
          Share your child&apos;s favourite moment and tag{" "}
          <a href={SITE.instagramHref} target="_blank" rel="noopener">
            {SITE.instagram}
          </a>
          . After delivery you can also leave a review on the product page.
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {reviews.map((r) => (
        <li key={r.id} className={styles.card}>
          <Stars rating={r.rating} />
          {r.comment && <p className={styles.comment}>“{r.comment}”</p>}
          <p className={styles.by}>
            {r.author} on <Link href={`/product/${r.productSlug}`}>{r.productName}</Link>
          </p>
        </li>
      ))}
    </ul>
  );
}
