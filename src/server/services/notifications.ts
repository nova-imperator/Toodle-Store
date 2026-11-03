import "server-only";
import { sendMail, teamRecipients } from "@/server/integrations/mailer";
import { formatPaise } from "@/lib/money";
import { SITE } from "@/config/site";

interface OrderMailData {
  orderNumber: string;
  email: string;
  total: number;
  items: { name: string; qty: number; unitPrice: number }[];
  address: { name: string; line1: string; city: string; state: string; pincode: string };
}

const itemsText = (o: OrderMailData) => o.items.map((i) => `• ${i.name} × ${i.qty} = ${formatPaise(i.unitPrice * i.qty)}`).join("\n");
const orderUrl = (n: string) => `${SITE.url}/order/${n}`;

export async function sendOrderConfirmation(o: OrderMailData) {
  await sendMail({
    to: o.email,
    subject: `Order ${o.orderNumber} confirmed – thank you!`,
    text: `Hi ${o.address.name},\n\nThank you for shopping at Toodle Store. Your order ${o.orderNumber} is confirmed and paid.\n\n${itemsText(o)}\n\nTotal paid: ${formatPaise(o.total)} (GST included, free delivery)\n\nDelivering to: ${o.address.line1}, ${o.address.city}, ${o.address.state} ${o.address.pincode}\n\nTrack your order: ${orderUrl(o.orderNumber)}\n\nQuestions? WhatsApp us on ${SITE.phone}.`,
  });
}

export async function sendCodEnquiryReceived(o: OrderMailData) {
  await sendMail({
    to: o.email,
    subject: `We got your cash on delivery request ${o.orderNumber}`,
    text: `Hi ${o.address.name},\n\nThank you! We've received your cash on delivery request ${o.orderNumber}. Our team will call you shortly to confirm it.\n\n${itemsText(o)}\n\nTotal to pay on delivery: ${formatPaise(o.total)}\n\nQuestions? WhatsApp us on ${SITE.phone}.`,
  });
  const team = teamRecipients();
  if (team.length) {
    await sendMail({
      to: team,
      subject: `New COD enquiry ${o.orderNumber} – ${formatPaise(o.total)}`,
      text: `New cash on delivery enquiry.\n\nOrder: ${o.orderNumber}\nCustomer: ${o.address.name} (${o.email})\nTotal: ${formatPaise(o.total)}\n\n${itemsText(o)}\n\nCall the customer, then confirm or close it in the admin panel.`,
    });
  }
}

export async function sendOrderStatusUpdate(o: { orderNumber: string; email: string; status: string; trackingUrl?: string | null }) {
  const words: Record<string, string> = {
    placed: "has been confirmed",
    packed: "is packed and ready to ship",
    shipped: "is on its way",
    delivered: "has been delivered. We hope they love it!",
    cancelled: "has been cancelled",
  };
  if (!words[o.status]) return;
  await sendMail({
    to: o.email,
    subject: `Your Toodle Store order ${o.orderNumber} ${words[o.status].split(".")[0]}`,
    text: `Your order ${o.orderNumber} ${words[o.status]}.${o.trackingUrl ? `\n\nTrack the parcel: ${o.trackingUrl}` : ""}\n\nOrder details: ${orderUrl(o.orderNumber)}`,
  });
}
