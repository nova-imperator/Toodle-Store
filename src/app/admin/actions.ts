"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { loginAdmin, logoutAdmin } from "@/server/auth/admin";
import { AppError } from "@/server/errors";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function adminLoginAction(_prev: { error: string | null }, form: FormData): Promise<{ error: string | null }> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  try {
    await loginAdmin(parsed.data.email, parsed.data.password);
  } catch (e) {
    return { error: e instanceof AppError ? e.message : "Login failed. Please try again." };
  }
  redirect("/admin");
}

export async function adminLogoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}
