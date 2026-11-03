"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

export function AdminNav({ links }: { links: { href: string; label: string; count: number }[] }) {
  const pathname = usePathname();
  const status = useSearchParams().get("status");
  const current = (href: string) => {
    const [path, query] = href.split("?");
    if (query) return pathname === path && `?${query}` === `?status=${status}`;
    return path === "/admin" ? pathname === "/admin" : pathname.startsWith(path) && !(path === "/admin/orders" && status === "cod_enquiry");
  };

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
