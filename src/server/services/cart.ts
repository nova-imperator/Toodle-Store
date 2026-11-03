import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { cookieOptions, getCurrentUser } from "@/server/auth/session";
import { evaluateCoupon } from "@/server/services/coupon";
import { includedGst } from "@/lib/money";
import type { BrickColor } from "@/config/catalogue";
import type { CartLine, CartView } from "@/types/cart";

const CART_COOKIE = "ts_cart";
const CART_DAYS = 60;
export const MAX_QTY_PER_ITEM = 10;

const cartInclude = {
  items: {
    orderBy: { id: "asc" as const },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
          categories: { include: { category: { select: { color: true, sortOrder: true } } } },
        },
      },
    },
  },
};

async function findCart(create: boolean) {
  const user = await getCurrentUser();
  if (user) {
    const existing = await db.cart.findUnique({ where: { userId: user.id }, include: cartInclude });
    if (existing || !create) return existing;
    return db.cart.create({ data: { userId: user.id }, include: cartInclude });
  }

  const jar = await cookies();
  const sid = jar.get(CART_COOKIE)?.value;
  if (sid) {
    const existing = await db.cart.findUnique({ where: { sessionId: sid }, include: cartInclude });
    if (existing || !create) return existing;
  }
  if (!create) return null;
  const newSid = randomUUID();
  jar.set(CART_COOKIE, newSid, cookieOptions(CART_DAYS));
  return db.cart.create({ data: { sessionId: newSid }, include: cartInclude });
}

type CartRow = NonNullable<Awaited<ReturnType<typeof findCart>>>;

async function toView(cart: CartRow | null): Promise<CartView> {
  const rows = (cart?.items ?? [])
    .filter((i) => i.product.status === "active")
    .map((i) => {
      const primary = [...i.product.categories].sort((a, b) => a.category.sortOrder - b.category.sortOrder)[0];
      const line: CartLine = {
        productId: i.productId,
        slug: i.product.slug,
        name: i.product.name,
        image: i.product.images[0]?.url ?? "/images/brand/logo.webp",
        color: (primary?.category.color ?? "blue") as BrickColor,
        qty: i.qty,
        unitPrice: i.product.salePrice,
        mrp: i.product.mrp,
        stockQty: i.product.stockQty,
        lineTotal: i.product.salePrice * i.qty,
      };
      return { line, gstRate: i.product.gstRate };
    });
  const lines = rows.map((r) => r.line);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.mrp * l.qty, 0);

  let discount = 0;
  let couponMessage: string | null = null;
  if (cart?.couponCode) {
    const check = await evaluateCoupon(cart.couponCode, subtotal);
    if (check.ok) discount = check.discount;
    else couponMessage = check.reason;
  }

  const total = subtotal - discount;
  const scale = subtotal ? total / subtotal : 0;
  const gstIncluded = rows.reduce((s, r) => s + includedGst(Math.round(r.line.lineTotal * scale), r.gstRate), 0);

  return {
    lines,
    couponCode: cart?.couponCode ?? null,
    couponMessage,
    totals: { count: lines.reduce((s, l) => s + l.qty, 0), mrpTotal, subtotal, discount, shipping: 0, gstIncluded, total },
  };
}

export async function getCart(): Promise<CartView> {
  return toView(await findCart(false));
}

async function checkStock(productId: string, qty: number) {
  const product = await db.product.findFirst({ where: { id: productId, status: "active" }, select: { stockQty: true, salePrice: true, name: true } });
  if (!product) throw new AppError("not_found", "This toy is no longer available.", 404);
  if (product.stockQty <= 0) throw new AppError("out_of_stock", `${product.name} is out of stock.`, 409);
  if (qty > product.stockQty) throw new AppError("insufficient_stock", `Only ${product.stockQty} left of ${product.name}.`, 409);
  return product;
}

export async function addToCart(productId: string, qty: number): Promise<CartView> {
  const cart = await findCart(true);
  if (!cart) throw new AppError("cart_unavailable", "Could not open your cart.", 500);
  const current = cart.items.find((i) => i.productId === productId)?.qty ?? 0;
  const next = Math.min(current + qty, MAX_QTY_PER_ITEM);
  const product = await checkStock(productId, next);
  await db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { qty: next, price: product.salePrice },
    create: { cartId: cart.id, productId, qty: next, price: product.salePrice },
  });
  return getCart();
}

export async function setQuantity(productId: string, qty: number): Promise<CartView> {
  const cart = await findCart(false);
  if (!cart) return getCart();
  if (qty <= 0) {
    await db.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    const product = await checkStock(productId, Math.min(qty, MAX_QTY_PER_ITEM));
    await db.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { qty: Math.min(qty, MAX_QTY_PER_ITEM), price: product.salePrice },
    });
  }
  return getCart();
}

export async function applyCoupon(code: string | null): Promise<CartView> {
  const cart = await findCart(true);
  if (!cart) throw new AppError("cart_unavailable", "Could not open your cart.", 500);
  if (code) {
    const subtotal = cart.items.reduce((s, i) => s + i.product.salePrice * i.qty, 0);
    const check = await evaluateCoupon(code, subtotal);
    if (!check.ok) throw new AppError("coupon_invalid", check.reason, 422);
  }
  await db.cart.update({ where: { id: cart.id }, data: { couponCode: code ? code.trim().toUpperCase() : null } });
  return getCart();
}

/** Moves the guest cart into the user's cart after login. */
export async function mergeGuestCart(userId: string) {
  const jar = await cookies();
  const sid = jar.get(CART_COOKIE)?.value;
  if (!sid) return;
  const guest = await db.cart.findUnique({ where: { sessionId: sid }, include: { items: true } });
  jar.delete(CART_COOKIE);
  if (!guest) return;

  const userCart = await db.cart.upsert({ where: { userId }, update: {}, create: { userId }, include: { items: true } });
  await db.$transaction([
    ...guest.items.map((g) => {
      const existing = userCart.items.find((u) => u.productId === g.productId);
      const qty = Math.min((existing?.qty ?? 0) + g.qty, MAX_QTY_PER_ITEM);
      return db.cartItem.upsert({
        where: { cartId_productId: { cartId: userCart.id, productId: g.productId } },
        update: { qty },
        create: { cartId: userCart.id, productId: g.productId, qty, price: g.price },
      });
    }),
    ...(guest.couponCode && !userCart.couponCode ? [db.cart.update({ where: { id: userCart.id }, data: { couponCode: guest.couponCode } })] : []),
    db.cart.delete({ where: { id: guest.id } }),
  ]);
}

/** Empties the signed-in user's cart after an order is placed. */
export async function clearCart(userId: string) {
  await db.cart.updateMany({ where: { userId }, data: { couponCode: null } });
  await db.cartItem.deleteMany({ where: { cart: { userId } } });
}
