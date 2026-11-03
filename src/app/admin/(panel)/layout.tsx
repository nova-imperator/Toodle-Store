import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { canAccess, getCurrentAdmin, type AdminModule } from "@/server/auth/admin";
import { db } from "@/server/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminLogoutAction } from "../actions";
import styles from "../admin.module.css";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

const MODULES: { module: AdminModule; href: string; label: string }[] = [
  { module: "dashboard", href: "/admin", label: "Dashboard" },
  { module: "orders", href: "/admin/orders", label: "Orders" },
  { module: "orders", href: "/admin/orders?status=cod_enquiry", label: "COD enquiries" },
  { module: "enquiries", href: "/admin/enquiries", label: "B2B enquiries" },
  { module: "products", href: "/admin/products", label: "Products" },
  { module: "customers", href: "/admin/customers", label: "Customers" },
  { module: "coupons", href: "/admin/coupons", label: "Coupons" },
  { module: "content", href: "/admin/redirects", label: "Redirects (SEO)" },
  { module: "settings", href: "/admin/settings", label: "Settings" },
];

const ROLE_LABEL = { admin: "Admin", order_manager: "Order manager", sales: "Sales / B2B" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [cod, enquiries] = await Promise.all([db.order.count({ where: { status: "cod_enquiry" } }), db.b2bEnquiry.count({ where: { status: "new" } })]);
  const counts: Record<string, number> = { "COD enquiries": cod, "B2B enquiries": enquiries };
  const links = MODULES.filter((m) => canAccess(admin.role, m.module)).map((m) => ({ href: m.href, label: m.label, count: counts[m.label] ?? 0 }));

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Link href="/admin" className={styles.sideBrand}>
          <Image src="/images/brand/logo.webp" alt="" width={520} height={489} />
          Toodle admin
        </Link>
        <Suspense>
          <AdminNav links={links} />
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
