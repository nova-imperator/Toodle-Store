import { z } from "zod";
import { INDIAN_STATES } from "@/config/india";

export const mobileSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number"));

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter the receiver's name").max(80),
  phone: mobileSchema,
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  city: z.string().trim().min(2, "Enter the city").max(60),
  state: z.enum(INDIAN_STATES as [string, ...string[]], { errorMap: () => ({ message: "Choose a state" }) }),
  line1: z.string().trim().min(5, "Enter house number and street").max(160),
  line2: z.string().trim().max(160).optional().or(z.literal("")),
  landmark: z.string().trim().max(80).optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  phone: mobileSchema,
  address: addressSchema,
  saveAddress: z.boolean().default(true),
  paymentMethod: z.enum(["razorpay", "cod"]),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(10),
});
