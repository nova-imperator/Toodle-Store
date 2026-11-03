import { logout } from "@/server/services/auth";
import { handle, ok } from "@/server/http";

export const POST = handle(async () => {
  await logout();
  return ok({ ok: true });
});
