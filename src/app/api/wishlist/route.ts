import { z } from "zod";
import { getWishlistIds, toggleWishlist } from "@/server/services/wishlist";
import { handle, ok, parseJson } from "@/server/http";

export const GET = handle(async () => ok({ ids: await getWishlistIds() }));

export const POST = handle(async (req: Request) => {
  const { productId } = await parseJson(req, z.object({ productId: z.string().min(1) }));
  return ok({ ids: await toggleWishlist(productId) });
});
