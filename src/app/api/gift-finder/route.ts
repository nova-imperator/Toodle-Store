import { z } from "zod";
import { findGifts } from "@/server/services/catalogue";
import { handle, ok } from "@/server/http";

const query = z.object({
  age: z.string().min(1).max(40),
  max: z.coerce.number().int().min(49).max(100000),
});

export const GET = handle(async (req: Request) => {
  const { age, max } = query.parse(Object.fromEntries(new URL(req.url).searchParams));
  return ok({ items: await findGifts(age, max) });
});
