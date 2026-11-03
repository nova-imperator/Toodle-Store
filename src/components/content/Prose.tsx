import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import styles from "./Prose.module.css";

export function ContentPage({ title, path, updated, children }: { title: string; path: string; updated?: string; children: ReactNode }) {
  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumbs items={[{ name: title, path }]} />
      <article className={styles.prose}>
        <h1>{title}</h1>
        {updated && <p className={styles.updated}>Last updated {updated}</p>}
        {children}
      </article>
    </div>
  );
}
