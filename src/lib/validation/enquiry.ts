import { z } from "zod";
import { BUSINESS_TYPES, ORDER_VALUES } from "@/config/b2b";
import { CATEGORIES } from "@/config/catalogue";
import { INDIAN_STATES } from "@/config/india";
import { mobileSchema } from "./checkout";

const optional = (max: number) => z.string().trim().max(max).optional().or(z.literal("")).transform((v) => v || undefined);

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: mobileSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(120),
  businessName: optional(120),
  businessType: z.enum(BUSINESS_TYPES, { errorMap: () => ({ message: "Choose your business type" }) }),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.enum(INDIAN_STATES as [string, ...string[]], { errorMap: () => ({ message: "Choose your state" }) }),
  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "That doesn't look like a valid GSTIN (15 characters)")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  categories: z.array(z.enum(CATEGORIES.map((c) => c.slug) as [string, ...string[]])).max(11).default([]),
  estOrderValue: z.enum(ORDER_VALUES).optional().or(z.literal("")).transform((v) => v || undefined),
  message: optional(1500),
  // Spam trap: real people never see or fill this field. The service ignores filled ones silently.
  website: z.string().max(300).optional(),
  sourcePage: optional(200),
  utmSource: optional(100),
  utmMedium: optional(100),
  utmCampaign: optional(100),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
