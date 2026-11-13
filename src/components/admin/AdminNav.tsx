"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

export function AdminNav({ links }: { links: { href: string; label: string; count: number }[] }) {
  const pathname = usePathname();
  const current = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav className={styles.sideNav} aria-label="Admin">
      {links.map((l) => (
        <Link key={l.href} href={l.href} aria-current={current(l.href) ? "page" : undefined}>
          {l.label}
          {l.count > 0 && <span className={styles.count}>{l.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
