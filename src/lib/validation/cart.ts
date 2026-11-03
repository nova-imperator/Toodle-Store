import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(0).max(10),
});

export const couponSchema = z.object({
  code: z.string().trim().min(3, "Enter a coupon code").max(30).nullable(),
});
