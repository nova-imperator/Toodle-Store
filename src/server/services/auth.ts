import "server-only";
import { db } from "@/server/db";
import { createSession, destroySession } from "@/server/auth/session";
import { verifyOtp } from "@/server/auth/otp";
import { verifyGoogleCredential } from "@/server/auth/google";
import { mergeGuestCart } from "./cart";
import { mergeGuestWishlist } from "./wishlist";

/** Starts a session and moves the guest cart and wishlist into the account. */
async function completeLogin(userId: string) {
  await createSession(userId);
  await mergeGuestCart(userId);
  await mergeGuestWishlist(userId);
}

/** Email OTP: first successful login creates the account, so login and signup are one step. */
export async function loginWithOtp(email: string, code: string) {
  await verifyOtp(email, code);
  const user = await db.user.upsert({
    where: { email },
    update: { lastLoginAt: new Date() },
    create: { email, authProvider: "email_otp", lastLoginAt: new Date() },
  });
  await completeLogin(user.id);
  return user;
}

/** Google: matched by email, so an OTP customer and a Google customer with the same email are one account. */
export async function loginWithGoogle(credential: string) {
  const profile = await verifyGoogleCredential(credential);
  const existing = await db.user.findUnique({ where: { email: profile.email } });
  const user = existing
    ? await db.user.update({
        where: { id: existing.id },
        data: { googleId: profile.sub, name: existing.name ?? profile.name, lastLoginAt: new Date() },
      })
    : await db.user.create({
        data: { email: profile.email, name: profile.name, googleId: profile.sub, authProvider: "google", lastLoginAt: new Date() },
      });
  await completeLogin(user.id);
  return user;
}

export async function logout() {
  await destroySession();
}
