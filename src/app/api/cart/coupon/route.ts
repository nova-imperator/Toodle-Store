import { applyCoupon } from "@/server/services/cart";
import { handle, ok, parseJson } from "@/server/http";
import { couponSchema } from "@/lib/validation/cart";

export const POST = handle(async (req: Request) => {
  const { code } = await parseJson(req, couponSchema);
  return ok(await applyCoupon(code));
});
