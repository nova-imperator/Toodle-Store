import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { rateLimit } from "@/server/http";
import { cookieOptions, readToken, signToken } from "./session";
import { verifyPassword } from "./password";

const ADMIN_COOKIE = "ts_admin";
const ADMIN_DAYS = 1;

/** Which roles may open which admin module. Admin can open everything. */
export const MODULE_ROLES = {
  dashboard: ["admin", "order_manager", "sales"],
  orders: ["admin", "order_manager"],
  products: ["admin", "order_manager"],
  customers: ["admin", "order_manager"],
  enquiries: ["admin", "sales"],
  coupons: ["admin"],
  content: ["admin"],
  settings: ["admin"],
} satisfies Record<string, AdminRole[]>;

export type AdminModule = keyof typeof MODULE_ROLES;

export async function loginAdmin(email: string, password: string) {
  rateLimit(`admin-login:${email}`, 8, 15 * 60_000);
  const admin = await db.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    throw new AppError("bad_login", "Email or password is incorrect.", 401);
  }
  const token = await signToken({ aid: admin.id }, ADMIN_DAYS);
  (await cookies()).set(ADMIN_COOKIE, token, { ...cookieOptions(ADMIN_DAYS), sameSite: "strict" });
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export const getCurrentAdmin = cache(async () => {
  const payload = await readToken((await cookies()).get(ADMIN_COOKIE)?.value);
  if (typeof payload?.aid !== "string") return null;
  return db.adminUser.findUnique({ where: { id: payload.aid }, select: { id: true, name: true, email: true, role: true } });
});

export function canAccess(role: AdminRole, module: AdminModule) {
  return (MODULE_ROLES[module] as AdminRole[]).includes(role);
}

/** For admin pages and server actions: redirects to login, or to the dashboard when the role lacks access. */
export async function requireAdmin(module: AdminModule) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (!canAccess(admin.role, module)) redirect("/admin?denied=1");
  return admin;
}
