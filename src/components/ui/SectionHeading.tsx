import Link from "next/link";
import styles from "./SectionHeading.module.css";

interface Props {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2";
  id?: string;
}

export function SectionHeading({ title, subtitle, action, as: Tag = "h2", id }: Props) {
  return (
    <div className={styles.wrap}>
      <div>
        <div className={styles.title}>
          <span className={styles.studs} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <Tag id={id}>{title}</Tag>
        </div>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className={styles.action}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
