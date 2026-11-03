import { loginWithOtp } from "@/server/services/auth";
import { clientIp, handle, ok, parseJson, rateLimit } from "@/server/http";
import { otpVerifySchema } from "@/lib/validation/auth";

export const POST = handle(async (req: Request) => {
  const { email, code } = await parseJson(req, otpVerifySchema);
  rateLimit(`otp-verify:${await clientIp()}`, 20, 10 * 60_000);
  const user = await loginWithOtp(email, code);
  return ok({ user: { name: user.name, email: user.email } });
});
