import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/auth/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import styles from "../admin.module.css";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <Image src="/images/brand/logo.webp" alt="Toodle Store" width={520} height={489} className={styles.loginLogo} priority />
        <h1>Store admin</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
