"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Counts = Record<string, number>;

const POLL_MS = 60_000;

/**
 * Sidebar with "new since you last looked" badges for orders, enquiries and customers.
 * Counts refresh every minute (and when the tab regains focus); the open section shows no badge,
 * and the browser tab title shows the total, e.g. "(2) Orders · Admin".
 */
export function AdminNav({ links, initialCounts }: { links: { href: string; label: string; badge?: string }[]; initialCounts: Counts }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const current = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  useEffect(() => {
    let stop = false;
    const refresh = async () => {
      try {
        const res = await fetch("/api/admin/badges", { cache: "no-store" });
        if (res.ok && !stop) setCounts(await res.json());
      } catch {
        // Offline for a moment: keep the last counts.
      }
    };
    void refresh(); // opening a list marks it seen on the server; pick that up straight away
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [pathname]);

  const shown = (l: { href: string; badge?: string }) => (l.badge && !current(l.href) ? (counts[l.badge] ?? 0) : 0);
  const total = links.reduce((sum, l) => sum + shown(l), 0);

  useEffect(() => {
    const base = document.title.replace(/^\(\d+\)\s*/, "");
    document.title = total > 0 ? `(${total}) ${base}` : base;
  }, [total, pathname]);

  return (
    <nav className={styles.sideNav} aria-label="Admin">
      {links.map((l) => {
        const n = shown(l);
        return (
          <Link key={l.href} href={l.href} aria-current={current(l.href) ? "page" : undefined}>
            {l.label}
            {n > 0 && (
              <span className={styles.count} aria-label={`${n} new`}>
                {n}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
