import Link from "next/link";
import styles from "./SectionHeading.module.css";

interface Props {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  as?: "h1" | "h2";
  id?: string;
  /** No coloured studs: the plainer business look used on the wholesale site. */
  plain?: boolean;
}

export function SectionHeading({ title, subtitle, action, as: Tag = "h2", id, plain = false }: Props) {
  return (
    <div className={styles.wrap}>
      <div>
        <div className={styles.title}>
          {!plain && (
            <span className={styles.studs} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
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
