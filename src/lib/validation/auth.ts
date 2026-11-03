import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address").max(120);

export const otpRequestSchema = z.object({ email: emailSchema });

export const otpVerifySchema = z.object({
  email: emailSchema,
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const googleSchema = z.object({ credential: z.string().min(20) });
