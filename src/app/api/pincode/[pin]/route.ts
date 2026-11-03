import { z } from "zod";
import { checkPincode } from "@/server/integrations/pincode";
import { AppError } from "@/server/errors";
import { clientIp, handle, ok, rateLimit } from "@/server/http";

const pinSchema = z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode");

export const GET = handle(async (_req: Request, { params }: { params: Promise<{ pin: string }> }) => {
  const pin = pinSchema.parse((await params).pin);
  rateLimit(`pin:${await clientIp()}`, 30, 60_000);
  const info = await checkPincode(pin);
  if (!info) throw new AppError("pincode_unknown", "We couldn't find that pincode. Please check it.", 404);
  return ok(info);
});
