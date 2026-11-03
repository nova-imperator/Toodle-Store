import "server-only";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";

export const listCoupons = () => db.coupon.findMany({ orderBy: [{ isActive: "desc" }, { code: "asc" }] });

export async function createCoupon(c: { code: string; type: "percent" | "flat"; value: number; minOrder: number; expiresAt: Date | null; usageLimit: number | null }) {
  if (c.type === "percent" && c.value > 90) throw new AppError("bad_value", "Percent coupons can't be more than 90%.");
  const exists = await db.coupon.findUnique({ where: { code: c.code } });
  if (exists) throw new AppError("duplicate", "A coupon with this code already exists.", 409);
  return db.coupon.create({ data: { ...c, minOrder: c.minOrder * 100 } });
}

export const setCouponActive = (code: string, isActive: boolean) => db.coupon.update({ where: { code }, data: { isActive } });
