import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { sendMail } from "@/server/integrations/mailer";
import { isDemoMode } from "@/config/demo";

const OTP_TTL_MS = 10 * 60_000;
const RESEND_AFTER_MS = 30_000;
const MAX_ATTEMPTS = 5;

function hash(email: string, code: string) {
  const pepper = process.env.OTP_PEPPER;
  if (!pepper) throw new Error("OTP_PEPPER must be set");
  return createHash("sha256").update(`${pepper}:${email}:${code}`).digest("hex");
}

/** Returns the code only in demo mode without SMTP, so reviewers can log in on the preview site. */
export async function requestOtp(email: string): Promise<{ demoCode?: string }> {
  const latest = await db.otpCode.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_AFTER_MS) {
    const wait = Math.ceil((RESEND_AFTER_MS - (Date.now() - latest.createdAt.getTime())) / 1000);
    throw new AppError("otp_too_soon", `Please wait ${wait} seconds before asking for a new code.`, 429);
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.$transaction([
    db.otpCode.updateMany({ where: { email, usedAt: null }, data: { usedAt: new Date() } }),
    db.otpCode.create({ data: { email, otpHash: hash(email, code), expiresAt: new Date(Date.now() + OTP_TTL_MS) } }),
  ]);

  await sendMail({
    to: email,
    subject: `${code} is your Toodle Store login code`,
    text: `Your Toodle Store login code is ${code}.\n\nIt expires in 10 minutes. If you didn't ask for it, you can ignore this email.`,
    html: `<p>Your Toodle Store login code is</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you didn't ask for it, you can ignore this email.</p>`,
  });
  return isDemoMode() && !process.env.SMTP_HOST ? { demoCode: code } : {};
}

/** Checks a code. Throws a friendly AppError when it is wrong, expired or used up. */
export async function verifyOtp(email: string, code: string) {
  const otp = await db.otpCode.findFirst({ where: { email, usedAt: null }, orderBy: { createdAt: "desc" } });
  if (!otp || otp.expiresAt < new Date()) throw new AppError("otp_expired", "This code has expired. Please ask for a new one.", 400);
  if (otp.attempts >= MAX_ATTEMPTS) throw new AppError("otp_locked", "Too many wrong tries. Please ask for a new code.", 429);

  const ok = timingSafeEqual(Buffer.from(otp.otpHash, "hex"), Buffer.from(hash(email, code), "hex"));
  if (!ok) {
    const attempts = otp.attempts + 1;
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts } });
    const left = MAX_ATTEMPTS - attempts;
    throw new AppError("otp_wrong", left > 0 ? `That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many wrong tries. Please ask for a new code.", 400);
  }
  await db.otpCode.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
}
