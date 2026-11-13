import { trackOrder } from "@/server/services/order";
import { AppError } from "@/server/errors";
import { clientIp, handle, ok, parseJson, rateLimit } from "@/server/http";
import { trackOrderSchema } from "@/lib/validation/track";

export const POST = handle(async (req: Request) => {
  // A real customer needs only a few tries; this stops anyone guessing order numbers.
  rateLimit(`track:${await clientIp()}`, 10, 10 * 60_000);
  const { orderNumber, email } = await parseJson(req, trackOrderSchema);
  const order = await trackOrder(orderNumber, email);
  if (!order) throw new AppError("not_found", "We couldn't find an order with that number and email. Please check both and try again.", 404);
  return ok(order);
});
