import "server-only";
import { db } from "@/server/db";
import { rateLimit } from "@/server/http";
import { sendMail, teamRecipients } from "@/server/integrations/mailer";
import { enquiryReceivedEmail } from "@/server/emails/templates";
import { CATEGORIES } from "@/config/catalogue";
import { SITE } from "@/config/site";
import type { EnquiryInput } from "@/lib/validation/enquiry";

const categoryNames = (slugs: string[]) => slugs.map((s) => CATEGORIES.find((c) => c.slug === s)?.name ?? s).join(", ") || "Not specified";

export async function createEnquiry(input: EnquiryInput, ip: string) {
  // Bots that fill the hidden field get a normal-looking success and nothing is saved.
  if (input.website) return { id: "ignored" };

  rateLimit(`enq-ip:${ip}`, 5, 60 * 60_000);
  const recent = await db.b2bEnquiry.count({ where: { phone: input.phone, createdAt: { gt: new Date(Date.now() - 24 * 3600_000) } } });
  if (recent >= 3) return { id: "duplicate" };

  const data = { ...input };
  delete data.website;
  const enquiry = await db.b2bEnquiry.create({ data: { ...data, ip } });

  // Short form: only name, phone and city are always there; other lines appear when given.
  const optionalLines: [string, string | undefined][] = [
    ["Email", data.email],
    ["Business", [data.businessName, data.businessType].filter(Boolean).join(" · ") || undefined],
    ["State", data.state],
    ["GSTIN", data.gstNumber],
    ["Categories", data.categories.length ? categoryNames(data.categories) : undefined],
    ["Estimated order", data.estOrderValue],
    ["Message", data.message],
  ];
  const summary = [
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}  (call or WhatsApp: https://wa.me/91${data.phone})`,
    `City: ${data.city}`,
    ...optionalLines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    `Source: ${data.sourcePage ?? "-"} | UTM ${data.utmSource ?? "-"}/${data.utmMedium ?? "-"}/${data.utmCampaign ?? "-"}`,
  ].join("\n");

  const team = teamRecipients();
  await Promise.all([
    team.length
      ? sendMail({ to: team, subject: `New B2B enquiry: ${data.fullName} (${data.city}) – please call`, text: `${summary}\n\nOpen in admin: ${SITE.url}/admin/enquiries/${enquiry.id}` })
      : Promise.resolve(),
    // Auto-reply only when an email was given (the short form doesn't ask for one).
    data.email ? sendMail({ to: data.email, ...enquiryReceivedEmail(data) }) : Promise.resolve(),
  ]);

  return { id: enquiry.id };
}
