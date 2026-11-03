import type { Metadata } from "next";
import { getCurrentUser } from "@/server/auth/session";
import { AccountNav } from "@/components/account/AccountNav";
import styles from "./layout.module.css";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className={`container ${styles.wrap}`}>
      <header className={styles.head}>
        <h1>{user ? `Hi ${user.name?.split(" ")[0] ?? "there"}!` : "My account"}</h1>
        {user && <p>{user.email}</p>}
      </header>
      <AccountNav signedIn={!!user} />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
