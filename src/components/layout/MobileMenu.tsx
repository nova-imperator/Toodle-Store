"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icon";
import { AGE_LINKS, CATEGORY_LINKS, QUICK_LINKS } from "@/config/navigation";
import { SITE } from "@/config/site";
import styles from "./MobileMenu.module.css";

export function MobileMenu({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button type="button" className={styles.burger} onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
        <Icon name="menu" />
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="left">
        <div className={styles.section}>
          <Link href={userName ? "/account" : "/login"} className={styles.account}>
            <Icon name="user" />
            {userName ? `Hi, ${userName}` : "Log in or sign up"}
          </Link>
        </div>

        <div className={styles.section}>
          <h3 className={styles.label}>Shop by age</h3>
          <ul className={styles.ages}>
            {AGE_LINKS.map((a) => (
              <li key={a.href}>
                <Link href={a.href} data-color={a.color} className={styles.age}>
                  {a.short}
                  <small>{a.label.includes("months") ? "months" : "yrs"}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.label}>Shop by category</h3>
          <ul className={styles.cats}>
            {CATEGORY_LINKS.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={styles.cat}>
                  <span className={styles.thumb}>
                    <Image src={c.image} alt="" width={44} height={47} />
                  </span>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <ul className={styles.links}>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/account/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link href="/b2b" className={styles.b2b}>
                Bulk / B2B orders
              </Link>
            </li>
          </ul>
        </div>

        <div className={`${styles.section} ${styles.contact}`}>
          <a href={SITE.whatsappHref}>
            <Icon name="whatsapp" size={20} /> WhatsApp {SITE.phone}
          </a>
        </div>
      </Drawer>
    </>
  );
}
