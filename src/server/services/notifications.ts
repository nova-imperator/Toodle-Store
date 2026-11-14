import "server-only";
import { sendMail } from "@/server/integrations/mailer";
import { orderConfirmedEmail, orderStatusEmail } from "@/server/emails/templates";

interface OrderMailData {
  orderNumber: string;
  email: string;
  total: number;
  shipping: number;
  /** > 0 for cash on delivery orders. */
  codFee: number;
  items: { name: string; qty: number; unitPrice: number }[];
  address: { name: string; line1: string; city: string; state: string; pincode: string };
}

export async function sendOrderConfirmation(o: OrderMailData) {
  await sendMail({ to: o.email, ...orderConfirmedEmail({ ...o, name: o.address.name }) });
}

export async function sendOrderStatusUpdate(o: {
  orderNumber: string;
  email: string;
  status: string;
  courier?: string | null;
  awbNumber?: string | null;
  trackingUrl?: string | null;
}) {
  const mail = orderStatusEmail(o);
  if (mail) await sendMail({ to: o.email, ...mail });
}
