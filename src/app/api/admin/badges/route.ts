import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/server/auth/admin";
import { badgeCounts } from "@/server/services/admin/badges";

/** Sidebar badges, polled by the admin panel every minute. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: { code: "unauthorized", message: "Log in again." } }, { status: 401 });
  return NextResponse.json(await badgeCounts(admin.id, admin.role), { headers: { "Cache-Control": "no-store" } });
}
