import "server-only";
import { db } from "@/server/db";
import { formatPaise } from "@/lib/money";

export type CouponCheck = { ok: true; discount: number } | { ok: false; reason: string };

/** Discount in paise for a coupon against a subtotal in paise. */
export async function evaluateCoupon(code: string, subtotal: number): Promise<CouponCheck> {
  const coupon = await db.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  const now = new Date();
  if (!coupon || !coupon.isActive) return { ok: false, reason: "This coupon code is not valid." };
  if (coupon.startsAt && coupon.startsAt > now) return { ok: false, reason: "This coupon is not active yet." };
  if (coupon.expiresAt && coupon.expiresAt < now) return { ok: false, reason: "This coupon has expired." };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) return { ok: false, reason: "This coupon has been fully used." };
  if (subtotal < coupon.minOrder) return { ok: false, reason: `Add items worth ${formatPaise(coupon.minOrder - subtotal)} more to use this coupon.` };

  const raw = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value * 100;
  return { ok: true, discount: Math.min(raw, subtotal) };
}
