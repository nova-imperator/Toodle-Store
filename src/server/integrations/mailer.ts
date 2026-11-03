import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export interface Mail {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

/** Sends an email. Without SMTP settings (local development) the email is printed to the server console. */
export async function sendMail(mail: Mail) {
  const t = getTransporter();
  if (!t) {
    console.info(`\n──── email (dev, not sent) ────\nTo: ${[mail.to].flat().join(", ")}\nSubject: ${mail.subject}\n\n${mail.text}\n───────────────────────────────\n`);
    return;
  }
  await t.sendMail({ from: process.env.MAIL_FROM, ...mail });
}

export function teamRecipients(): string[] {
  return (process.env.TEAM_ALERT_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}
