import { getCart } from "@/server/services/cart";
import { handle, ok } from "@/server/http";

export const GET = handle(async () => ok(await getCart()));
