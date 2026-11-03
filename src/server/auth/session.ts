import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/server/db";

export const SESSION_COOKIE = "ts_session";
const SESSION_DAYS = 30;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function signToken(payload: Record<string, string>, expiresInDays: number) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${expiresInDays}d`).sign(secret());
}

export async function readToken(token: string | undefined): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAgeDays: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: maxAgeDays * 24 * 60 * 60,
});

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const session = await db.session.create({ data: { userId, expiresAt } });
  const token = await signToken({ sid: session.id }, SESSION_DAYS);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_DAYS));
}

/** The signed-in customer for this request, or null. Cached per request. */
export const getCurrentUser = cache(async () => {
  const payload = await readToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (typeof payload?.sid !== "string") return null;
  const session = await db.session.findUnique({ where: { id: payload.sid }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

export async function destroySession() {
  const jar = await cookies();
  const payload = await readToken(jar.get(SESSION_COOKIE)?.value);
  if (typeof payload?.sid === "string") await db.session.deleteMany({ where: { id: payload.sid } });
  jar.delete(SESSION_COOKIE);
}
