import type { EnquiryStatus } from "@prisma/client";
import { getCurrentAdmin, canAccess } from "@/server/auth/admin";
import { exportEnquiriesCsv } from "@/server/services/admin/enquiries";
import { ENQUIRY_STATUS_LABEL } from "@/config/orders";

export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin || !canAccess(admin.role, "enquiries")) return new Response("Not allowed", { status: 403 });

  const url = new URL(req.url);
  const s = url.searchParams.get("status");
  const status = s && s in ENQUIRY_STATUS_LABEL ? (s as EnquiryStatus) : undefined;
  const csv = await exportEnquiriesCsv({ status, q: url.searchParams.get("q")?.trim() || undefined });
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="toodle-b2b-enquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
