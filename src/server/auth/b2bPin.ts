import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { readToken, signToken } from "./session";
import { rateLimit } from "@/server/http";
import { AppError } from "@/server/errors";

// Extra PIN in front of Admin → B2B enquiries (owner, 28 Nov 2026). The PIN lives in the B2B_PANEL_PIN
// environment variable (never in this public repo). Unlocking lasts 12 hours per browser and admin.
const COOKIE = "ts_b2b_pin";
const HOURS = 12;

export function b2bPinEnabled() {
  return !!process.env.B2B_PANEL_PIN;
}

export async function isB2bUnlocked(adminId: string) {
  if (!b2bPinEnabled()) return true;
  const payload = await readToken((await cookies()).get(COOKIE)?.value);
  return payload?.b2b === adminId && typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
}

const digest = (s: string) => createHash("sha256").update(s).digest();

export async function unlockB2b(adminId: string, pin: string) {
  rateLimit(`b2b-pin:${adminId}`, 6, 15 * 60_000);
  const expected = process.env.B2B_PANEL_PIN ?? "";
  if (!expected || !timingSafeEqual(digest(pin.trim()), digest(expected))) throw new AppError("bad_pin", "That PIN isn't right.", 401);
  const token = await signToken({ b2b: adminId }, HOURS / 24);
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: HOURS * 3600 });
}

export async function lockB2b() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
