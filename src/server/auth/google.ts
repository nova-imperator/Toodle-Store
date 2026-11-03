import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { AppError } from "@/server/errors";

const JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string | null;
}

/** Verifies a Google Identity Services ID token (Sign in with Google / One Tap). */
export async function verifyGoogleCredential(credential: string): Promise<GoogleProfile> {
  const audience = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!audience) throw new AppError("google_disabled", "Google sign-in is not set up yet.", 503);
  try {
    const { payload } = await jwtVerify(credential, JWKS, { audience, issuer: ["https://accounts.google.com", "accounts.google.com"] });
    if (typeof payload.email !== "string" || payload.email_verified !== true || typeof payload.sub !== "string") {
      throw new Error("unverified");
    }
    return { sub: payload.sub, email: payload.email.toLowerCase(), name: typeof payload.name === "string" ? payload.name : null };
  } catch {
    throw new AppError("google_invalid", "Google sign-in failed. Please try again or use email.", 401);
  }
}
