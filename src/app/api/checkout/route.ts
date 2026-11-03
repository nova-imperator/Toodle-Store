import { getCurrentUser } from "@/server/auth/session";
import { placeOrder } from "@/server/services/order";
import { AppError } from "@/server/errors";
import { handle, ok, parseJson, rateLimit } from "@/server/http";
import { checkoutSchema } from "@/lib/validation/checkout";

export const POST = handle(async (req: Request) => {
  const user = await getCurrentUser();
  if (!user) throw new AppError("login_required", "Please log in to place your order.", 401);
  rateLimit(`checkout:${user.id}`, 10, 10 * 60_000);
  const input = await parseJson(req, checkoutSchema);
  return ok(await placeOrder(user, input));
});
