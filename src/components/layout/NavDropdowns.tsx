"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AGE_LINKS, CATEGORY_LINKS } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";
import styles from "./NavDropdowns.module.css";

type Menu = "category" | "age" | null;

export function NavDropdowns() {
  const [open, setOpen] = useState<Menu>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(null), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trigger = (menu: Exclude<Menu, null>, label: string) => (
    <button
      type="button"
      className={styles.trigger}
      aria-expanded={open === menu}
      aria-controls={`menu-${menu}`}
      onClick={() => setOpen(open === menu ? null : menu)}
    >
      {label}
      <Icon name="down" size={18} className={open === menu ? styles.flip : undefined} />
    </button>
  );

  return (
    <div ref={ref} className={styles.wrap}>
      {trigger("category", "Shop by Category")}
      {trigger("age", "Shop by Age")}

      {open === "category" && (
        <div id="menu-category" className={styles.panel}>
          <ul className={styles.catGrid}>
            {CATEGORY_LINKS.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={styles.cat} data-color={c.color}>
                  <span className={styles.catImg}>
                    <Image src={c.image} alt="" width={80} height={85} />
                  </span>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/shop" className={styles.all}>
            See all toys
          </Link>
        </div>
      )}

      {open === "age" && (
        <div id="menu-age" className={`${styles.panel} ${styles.agePanel}`}>
          <ul className={styles.ageRow}>
            {AGE_LINKS.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className={styles.age} data-color={a.color}>
                  <span className={styles.ageNum}>{a.short}</span>
                  <span>{a.label.includes("months") ? "months" : "years"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
