import "server-only";
import type { EnquiryStatus, Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { CATEGORIES } from "@/config/catalogue";
import { ADMIN_PAGE } from "./orders";

function where({ status, q }: { status?: EnquiryStatus; q?: string }): Prisma.B2bEnquiryWhereInput {
  return {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { businessName: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function listEnquiries(f: { status?: EnquiryStatus; q?: string; page?: number }) {
  const page = f.page ?? 1;
  const [rows, total] = await Promise.all([
    db.b2bEnquiry.findMany({ where: where(f), orderBy: { createdAt: "desc" }, skip: (page - 1) * ADMIN_PAGE, take: ADMIN_PAGE, include: { assignee: { select: { name: true } } } }),
    db.b2bEnquiry.count({ where: where(f) }),
  ]);
  return { rows, total, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE)) };
}

export function getEnquiry(id: string) {
  return db.b2bEnquiry.findUnique({ where: { id }, include: { assignee: true } });
}

export function updateEnquiry(id: string, data: { status: EnquiryStatus; assignedTo: string | null; notes: string | null }) {
  return db.b2bEnquiry.update({ where: { id }, data });
}

export const listAssignees = () => db.adminUser.findMany({ where: { role: { in: ["admin", "sales"] } }, select: { id: true, name: true }, orderBy: { name: "asc" } });

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Prefix formula-looking values so spreadsheet apps don't execute them.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

/** CSV that opens directly in Excel (UTF-8 with BOM). */
export async function exportEnquiriesCsv(f: { status?: EnquiryStatus; q?: string }) {
  const rows = await db.b2bEnquiry.findMany({ where: where(f), orderBy: { createdAt: "desc" }, include: { assignee: { select: { name: true } } } });
  const head = ["Date", "Name", "Phone", "Email", "Business", "Type", "City", "State", "GSTIN", "Categories", "Order value", "Message", "Status", "Assigned to", "Notes", "Source", "UTM source", "UTM medium", "UTM campaign"];
  const names = (v: Prisma.JsonValue) => (Array.isArray(v) ? v.map((s) => CATEGORIES.find((c) => c.slug === s)?.name ?? s).join("; ") : "");
  const body = rows.map((r) =>
    [
      r.createdAt.toISOString().slice(0, 16).replace("T", " "), r.fullName, r.phone, r.email, r.businessName, r.businessType, r.city, r.state, r.gstNumber,
      names(r.categories), r.estOrderValue, r.message, r.status, r.assignee?.name, r.notes, r.sourcePage, r.utmSource, r.utmMedium, r.utmCampaign,
    ].map(csvCell).join(","),
  );
  return "﻿" + [head.map(csvCell).join(","), ...body].join("\r\n");
}
