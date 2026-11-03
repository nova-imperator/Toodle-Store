import { createEnquiry } from "@/server/services/enquiry";
import { clientIp, handle, ok, parseJson } from "@/server/http";
import { enquirySchema } from "@/lib/validation/enquiry";

export const POST = handle(async (req: Request) => {
  const input = await parseJson(req, enquirySchema);
  await createEnquiry(input, await clientIp());
  return ok({ ok: true });
});
