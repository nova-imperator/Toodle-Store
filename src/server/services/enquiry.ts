import "server-only";
import { db } from "@/server/db";
import { rateLimit } from "@/server/http";
import { sendMail, teamRecipients } from "@/server/integrations/mailer";
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

  const summary = [
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Business: ${data.businessName ?? "-"} (${data.businessType})`,
    `Location: ${data.city}, ${data.state}`,
    `GSTIN: ${data.gstNumber ?? "-"}`,
    `Categories: ${categoryNames(data.categories)}`,
    `Estimated order: ${data.estOrderValue ?? "-"}`,
    `Message: ${data.message ?? "-"}`,
    `Source: ${data.sourcePage ?? "-"} | UTM ${data.utmSource ?? "-"}/${data.utmMedium ?? "-"}/${data.utmCampaign ?? "-"}`,
  ].join("\n");

  const team = teamRecipients();
  await Promise.all([
    team.length
      ? sendMail({ to: team, subject: `New B2B enquiry: ${data.businessName ?? data.fullName} (${data.city})`, text: `${summary}\n\nOpen in admin: ${SITE.url}/admin/enquiries/${enquiry.id}` })
      : Promise.resolve(),
    sendMail({
      to: data.email,
      subject: "We've received your Toodle Store wholesale enquiry",
      text: `Hi ${data.fullName.split(" ")[0]},\n\nThank you for your enquiry. Our team will call you on ${data.phone} within 24 hours with our wholesale price list.\n\nNeed us sooner? WhatsApp ${SITE.phone}.\n\nToodle Store`,
    }),
  ]);

  return { id: enquiry.id };
}
