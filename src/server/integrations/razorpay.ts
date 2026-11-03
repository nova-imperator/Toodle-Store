import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AppError } from "@/server/errors";
import { isDemoMode } from "@/config/demo";

const API = "https://api.razorpay.com/v1";

const keyId = () => process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = () => process.env.RAZORPAY_KEY_SECRET ?? "";

/** Without keys, development (or an explicit demo deployment) runs a simulated payment flow. */
export function isMockPayments() {
  const mock = !keyId() || !keySecret();
  if (mock && process.env.NODE_ENV === "production" && !isDemoMode()) throw new Error("Razorpay keys are required in production");
  return mock;
}

export const publicKeyId = () => (isMockPayments() ? "mock" : keyId());

function authHeader() {
  return `Basic ${Buffer.from(`${keyId()}:${keySecret()}`).toString("base64")}`;
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Razorpay error", data);
    throw new AppError("payment_gateway", "The payment service is busy. Please try again in a moment.", 502);
  }
  return data as T;
}

export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  if (isMockPayments()) return { id: `mock_order_${randomBytes(8).toString("hex")}`, amount: amountPaise };
  return call<{ id: string; amount: number }>("/orders", { amount: amountPaise, currency: "INR", receipt, notes });
}

export async function createRefund(paymentId: string, amountPaise: number) {
  if (isMockPayments()) return { id: `mock_rfnd_${randomBytes(6).toString("hex")}`, status: "processed" };
  return call<{ id: string; status: string }>(`/payments/${paymentId}/refund`, { amount: amountPaise });
}

function safeEqualHex(a: string, b: string) {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Checkout handler signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", keySecret()).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
