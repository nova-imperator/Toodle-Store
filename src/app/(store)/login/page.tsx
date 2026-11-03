import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/safeRedirect";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Log in or sign up", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.intro}>
        <Image src="/images/brand/mascot-delivery.webp" alt="" width={376} height={520} className={styles.mascot} priority />
        <h1>Hello! Let&apos;s get you in.</h1>
        <p>Log in with a one-time code sent to your email. Your cart and wishlist come with you.</p>
      </div>
      <LoginForm next={next} />
    </div>
  );
}
