import "server-only";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { cookieOptions, getCurrentUser } from "@/server/auth/session";
import { getProductsByIds } from "@/server/services/catalogue";

// Guests keep their wishlist in a cookie; it moves into the wishlists table on login.
const GUEST_COOKIE = "ts_wish";
const GUEST_MAX = 40;

async function readGuest(): Promise<string[]> {
  const raw = (await cookies()).get(GUEST_COOKIE)?.value;
  if (!raw) return [];
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((i): i is string => typeof i === "string").slice(0, GUEST_MAX) : [];
  } catch {
    return [];
  }
}

export async function getWishlistIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return readGuest();
  const rows = await db.wishlistItem.findMany({ where: { userId: user.id }, select: { productId: true }, orderBy: { createdAt: "desc" } });
  return rows.map((r) => r.productId);
}

export async function toggleWishlist(productId: string): Promise<string[]> {
  const user = await getCurrentUser();
  if (user) {
    const key = { userId_productId: { userId: user.id, productId } };
    const existing = await db.wishlistItem.findUnique({ where: key });
    if (existing) await db.wishlistItem.delete({ where: key });
    else await db.wishlistItem.create({ data: { userId: user.id, productId } });
    return getWishlistIds();
  }
  const ids = await readGuest();
  const next = ids.includes(productId) ? ids.filter((i) => i !== productId) : [productId, ...ids].slice(0, GUEST_MAX);
  (await cookies()).set(GUEST_COOKIE, JSON.stringify(next), cookieOptions(60));
  return next;
}

export async function mergeGuestWishlist(userId: string) {
  const ids = await readGuest();
  (await cookies()).delete(GUEST_COOKIE);
  if (!ids.length) return;
  const valid = await db.product.findMany({ where: { id: { in: ids } }, select: { id: true } });
  await db.wishlistItem.createMany({ data: valid.map((p) => ({ userId, productId: p.id })), skipDuplicates: true });
}

export async function getWishlistProducts() {
  const ids = await getWishlistIds();
  const products = await getProductsByIds(ids);
  return ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);
}
