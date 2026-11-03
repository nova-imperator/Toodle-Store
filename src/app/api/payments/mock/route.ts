import { z } from "zod";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/server/auth/session";
import { isMockPayments } from "@/server/integrations/razorpay";
import { markPaymentCaptured, markPaymentFailed } from "@/server/services/order";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { handle, ok, parseJson } from "@/server/http";

const schema = z.object({ razorpayOrderId: z.string().startsWith("mock_order_"), outcome: z.enum(["success", "failure"]) });

/** Stand-in for Razorpay Checkout when no keys are configured (development or DEMO_MODE only). */
export const POST = handle(async (req: Request) => {
  if (!isMockPayments()) throw new AppError("not_found", "Not found", 404);
  const user = await getCurrentUser();
  if (!user) throw new AppError("login_required", "Please log in again.", 401);
  const { razorpayOrderId, outcome } = await parseJson(req, schema);

  const payment = await db.payment.findUnique({ where: { razorpayOrderId }, include: { order: true } });
  if (!payment || payment.order.userId !== user.id) throw new AppError("not_found", "Payment not found", 404);

  if (outcome === "failure") {
    await markPaymentFailed(razorpayOrderId);
    throw new AppError("payment_failed", "Payment failed (test mode). Your cart and address are saved, please try again.", 402);
  }
  const order = await markPaymentCaptured(razorpayOrderId, { paymentId: `mock_pay_${randomBytes(6).toString("hex")}`, method: "upi" });
  return ok({ orderNumber: order.orderNumber });
});
