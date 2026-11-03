import styles from "./StudLoader.module.css";

export function StudLoader({ label = "Loading", center = false }: { label?: string; center?: boolean }) {
  const loader = (
    <span className={styles.loader} role="status" aria-label={label}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
  return center ? <div className={styles.center}>{loader}</div> : loader;
}
