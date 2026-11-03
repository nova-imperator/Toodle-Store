import { getCurrentUser } from "@/server/auth/session";
import { markPaymentCaptured } from "@/server/services/order";
import { verifyPaymentSignature } from "@/server/integrations/razorpay";
import { AppError } from "@/server/errors";
import { handle, ok, parseJson } from "@/server/http";
import { verifyPaymentSchema } from "@/lib/validation/checkout";

export const POST = handle(async (req: Request) => {
  const user = await getCurrentUser();
  if (!user) throw new AppError("login_required", "Please log in again.", 401);
  const body = await parseJson(req, verifyPaymentSchema);
  if (!verifyPaymentSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) {
    throw new AppError("bad_signature", "We couldn't verify this payment. If money was deducted, it will be confirmed automatically or refunded by Razorpay.", 400);
  }
  const order = await markPaymentCaptured(body.razorpay_order_id, { paymentId: body.razorpay_payment_id, signature: body.razorpay_signature });
  return ok({ orderNumber: order.orderNumber });
});
