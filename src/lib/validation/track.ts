import { z } from "zod";
import { emailSchema } from "./auth";

export const orderNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .transform((v) => v.replace(/^#/, ""))
  .pipe(z.string().regex(/^TS\d{10}$/, "Order numbers look like TS2611135854"));

export const trackOrderSchema = z.object({ orderNumber: orderNumberSchema, email: emailSchema });
