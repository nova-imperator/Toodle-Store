import { requireAdmin } from "@/server/auth/admin";
import { isMockPayments } from "@/server/integrations/razorpay";
import { teamRecipients } from "@/server/integrations/mailer";
import { SITE } from "@/config/site";
import styles from "../../admin.module.css";

export const metadata = { title: "Settings" };

/** Read-only view of integrations. Secrets live in environment variables, never in the database or UI. */
export default async function SettingsPage() {
  await requireAdmin("settings");
  const checks = [
    { name: "Razorpay payments", ok: !isMockPayments(), detail: isMockPayments() ? "Not configured: checkout runs in test (mock) mode" : "Live keys configured" },
    { name: "Razorpay webhook", ok: !!process.env.RAZORPAY_WEBHOOK_SECRET, detail: `Webhook URL: ${SITE.url}/api/payments/razorpay/webhook (events: payment.captured, payment.failed, refund.processed)` },
    { name: "Email (SMTP)", ok: !!process.env.SMTP_HOST, detail: process.env.SMTP_HOST ? `Sending via ${process.env.SMTP_HOST}` : "Not configured: emails are printed to the server log" },
    { name: "Team alert emails", ok: teamRecipients().length > 0, detail: teamRecipients().join(", ") || "Add TEAM_ALERT_EMAILS for COD and B2B alerts" },
    { name: "Google sign-in", ok: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, detail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "Enabled" : "Hidden until NEXT_PUBLIC_GOOGLE_CLIENT_ID is set" },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Settings</h1>
          <p className={styles.sub}>Keys and passwords are set in the server environment (.env), never here.</p>
        </div>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <tbody>
            {checks.map((c) => (
              <tr key={c.name}>
                <td><strong>{c.name}</strong></td>
                <td><span className={styles.pill} data-tone={c.ok ? "green" : "yellow"}>{c.ok ? "Ready" : "Action needed"}</span></td>
                <td className={styles.wrap}>{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
