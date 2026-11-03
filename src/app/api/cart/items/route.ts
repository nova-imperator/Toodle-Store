import { addToCart, setQuantity } from "@/server/services/cart";
import { handle, ok, parseJson } from "@/server/http";
import { cartItemSchema } from "@/lib/validation/cart";

export const POST = handle(async (req: Request) => {
  const { productId, qty } = await parseJson(req, cartItemSchema);
  return ok(await addToCart(productId, Math.max(qty, 1)));
});

export const PATCH = handle(async (req: Request) => {
  const { productId, qty } = await parseJson(req, cartItemSchema);
  return ok(await setQuantity(productId, qty));
});
