"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { Icon } from "@/components/ui/Icon";
import styles from "./AccountNav.module.css";

const LINKS = [
  { href: "/account/orders", label: "My orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
];

export function AccountNav({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  };

  return (
    <nav className={styles.nav} aria-label="Account">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
      {signedIn ? (
        <button type="button" onClick={logout} className={styles.logout}>
          <Icon name="logout" size={18} /> Log out
        </button>
      ) : (
        <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={styles.logout}>
          Log in
        </Link>
      )}
    </nav>
  );
}
