"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { EnquiryStatus, OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/server/auth/admin";
import { AppError } from "@/server/errors";
import { confirmCod, refundOrder, updateOrderStatus } from "@/server/services/admin/orders";
import { saveProduct } from "@/server/services/admin/products";
import { updateEnquiry } from "@/server/services/admin/enquiries";
import { createCoupon, setCouponActive } from "@/server/services/admin/coupons";
import { addRedirect, deleteRedirect } from "@/server/services/redirects";
import { productFormSchema } from "@/lib/validation/adminProduct";

export interface ActionState {
  error: string | null;
  ok?: string;
  fields?: Record<string, string>;
}

const message = (e: unknown) => {
  if (e instanceof AppError) return e.message;
  console.error(e);
  return "Something went wrong. Please try again.";
};

// ─── Orders ──────────────────────────────────────────

const statusSchema = z.object({
  status: z.enum(["packed", "shipped", "delivered", "cancelled"]),
  courier: z.string().trim().max(60).optional(),
  awbNumber: z.string().trim().max(60).optional(),
  trackingUrl: z.string().trim().url("Enter a full tracking link starting with https://").optional().or(z.literal("")),
});

export async function orderStatusAction(orderId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("orders");
  const parsed = statusSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const { status, ...shipment } = parsed.data;
    await updateOrderStatus(orderId, status as OrderStatus, shipment);
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null, ok: "Order updated and customer notified." };
}

export async function confirmCodAction(orderId: string): Promise<ActionState> {
  await requireAdmin("orders");
  try {
    await confirmCod(orderId);
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null, ok: "COD order confirmed. Stock reserved." };
}

export async function refundAction(orderId: string): Promise<ActionState> {
  const admin = await requireAdmin("orders");
  if (admin.role !== "admin") return { error: "Only an Admin can issue refunds." };
  try {
    await refundOrder(orderId);
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath(`/admin/orders/${orderId}`);
  return { error: null, ok: "Refund issued through Razorpay." };
}

// ─── Products ────────────────────────────────────────

export async function saveProductAction(productId: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("products");
  const raw = {
    ...Object.fromEntries(form),
    categoryIds: form.getAll("categoryIds"),
    ageGroupIds: form.getAll("ageGroupIds"),
    isBestSeller: form.get("isBestSeller") === "on",
    isNewArrival: form.get("isNewArrival") === "on",
    isDeal: form.get("isDeal") === "on",
    isB2bVisible: form.get("isB2bVisible") === "on",
  };
  const parsed = productFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return { error: "Please fix the highlighted fields.", fields };
  }
  let id: string;
  try {
    id = (await saveProduct(productId, parsed.data)).id;
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath("/", "layout");
  if (!productId) redirect(`/admin/products/${id}?saved=1`);
  return { error: null, ok: "Product saved." };
}

// ─── B2B enquiries ───────────────────────────────────

const enquirySchema = z.object({
  status: z.enum(["new", "contacted", "quote_sent", "won", "lost"]),
  assignedTo: z.string().optional(),
  notes: z.string().max(4000).optional(),
});

export async function updateEnquiryAction(id: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("enquiries");
  const parsed = enquirySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await updateEnquiry(id, { status: parsed.data.status as EnquiryStatus, assignedTo: parsed.data.assignedTo || null, notes: parsed.data.notes?.trim() || null });
  revalidatePath("/admin/enquiries");
  return { error: null, ok: "Enquiry updated." };
}

// ─── Coupons ─────────────────────────────────────────

const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, "Code: 3–20 letters or numbers"),
  type: z.enum(["percent", "flat"]),
  value: z.coerce.number().int().min(1, "Enter a value"),
  minOrder: z.coerce.number().int().min(0).default(0),
  expiresAt: z.string().optional(),
  usageLimit: z.string().optional(),
});

export async function createCouponAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("coupons");
  const parsed = couponSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const c = parsed.data;
  try {
    await createCoupon({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      expiresAt: c.expiresAt ? new Date(`${c.expiresAt}T23:59:59+05:30`) : null,
      usageLimit: c.usageLimit ? Number(c.usageLimit) : null,
    });
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath("/admin/coupons");
  return { error: null, ok: `Coupon ${c.code} created.` };
}

// ─── Redirects (SEO) ─────────────────────────────────

export async function addRedirectAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("content");
  try {
    await addRedirect(String(form.get("oldUrl") ?? ""), String(form.get("newUrl") ?? ""));
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath("/admin/redirects");
  return { error: null, ok: "Redirect saved." };
}

export async function deleteRedirectAction(oldUrl: string) {
  await requireAdmin("content");
  await deleteRedirect(oldUrl);
  revalidatePath("/admin/redirects");
}

export async function toggleCouponAction(code: string, active: boolean) {
  await requireAdmin("coupons");
  await setCouponActive(code, active);
  revalidatePath("/admin/coupons");
}
