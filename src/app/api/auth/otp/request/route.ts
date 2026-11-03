import { requestOtp } from "@/server/auth/otp";
import { clientIp, handle, ok, parseJson, rateLimit } from "@/server/http";
import { otpRequestSchema } from "@/lib/validation/auth";

export const POST = handle(async (req: Request) => {
  const { email } = await parseJson(req, otpRequestSchema);
  rateLimit(`otp-ip:${await clientIp()}`, 10, 10 * 60_000);
  const { demoCode } = await requestOtp(email);
  return ok({ sent: true, demoCode });
});
