import { loginWithGoogle } from "@/server/services/auth";
import { handle, ok, parseJson } from "@/server/http";
import { googleSchema } from "@/lib/validation/auth";

export const POST = handle(async (req: Request) => {
  const { credential } = await parseJson(req, googleSchema);
  const user = await loginWithGoogle(credential);
  return ok({ user: { name: user.name, email: user.email } });
});
