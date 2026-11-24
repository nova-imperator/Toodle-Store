import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { canAccess, getCurrentAdmin, type AdminModule } from "@/server/auth/admin";
import { badgeCounts, type BadgeKey } from "@/server/services/admin/badges";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminLogoutAction } from "../actions";
import styles from "../admin.module.css";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

const MODULES: { module: AdminModule; href: string; label: string; badge?: BadgeKey }[] = [
  { module: "dashboard", href: "/admin", label: "Dashboard" },
  { module: "orders", href: "/admin/orders", label: "Orders", badge: "orders" },
  { module: "enquiries", href: "/admin/enquiries", label: "B2B enquiries", badge: "enquiries" },
  { module: "products", href: "/admin/products", label: "Products" },
  { module: "customers", href: "/admin/customers", label: "Customers", badge: "customers" },
  { module: "coupons", href: "/admin/coupons", label: "Coupons" },
  { module: "content", href: "/admin/redirects", label: "Redirects (SEO)" },
  { module: "settings", href: "/admin/settings", label: "Settings" },
];

const ROLE_LABEL = { admin: "Admin", order_manager: "Order manager", sales: "Sales / B2B" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  // Badges = new since this admin last opened each list (see services/admin/badges.ts).
  const counts = await badgeCounts(admin.id, admin.role);
  const links = MODULES.filter((m) => canAccess(admin.role, m.module)).map((m) => ({ href: m.href, label: m.label, badge: m.badge }));

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Link href="/admin" className={styles.sideBrand}>
          <Image src="/images/brand/logo.webp" alt="" width={520} height={489} />
          Toodle admin
        </Link>
        <Suspense>
          <AdminNav links={links} initialCounts={counts} />
        </Suspense>
        <div className={styles.sideFoot}>
          <div>
            {admin.name} · {ROLE_LABEL[admin.role]}
          </div>
          <Link href="/" target="_blank">
            View store
          </Link>
          <form action={adminLogoutAction}>
            <button type="submit">Log out</button>
          </form>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
