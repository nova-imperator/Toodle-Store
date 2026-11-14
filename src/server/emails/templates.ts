import "server-only";
import { SITE, WHATSAPP_BULK_HREF } from "@/config/site";
import { formatPaise } from "@/lib/money";
import { BRAND, asset, button, emailLayout, escapeHtml, heading, panel, paragraph, siteLink } from "./layout";

export interface Email {
  subject: string;
  text: string;
  html: string;
}

const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";
const trackLink = (orderNumber: string) => siteLink(`/track-order?order=${orderNumber}`);
const firstName = (name: string) => escapeHtml(name.trim().split(/\s+/)[0] || "there");

/** Each digit on its own tile, all in one brand colour so the code is easy to read. */
function codeTiles(code: string) {
  const tiles = [...code]
    .map(
      (d) =>
        `<td style="padding:0 4px"><div style="width:46px;height:58px;line-height:58px;border-radius:12px;background:${BRAND.blue};box-shadow:0 4px 0 #1660AD;font-family:${FONT};font-size:32px;font-weight:bold;color:#ffffff;text-align:center">${d}</div></td>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px auto 22px"><tr>${tiles}</tr></table>`;
}

export function loginCodeEmail(code: string): Email {
  const body = [
    heading("You're almost in! 👋"),
    paragraph("Here's your login code. Enter it on the Toodle Store page to continue."),
    codeTiles(code),
    panel(
      `<div style="text-align:center;font-size:15px;line-height:1.6">The code is valid for <strong>10 minutes</strong> and works only once.<br>Please don't share it with anyone.</div>`,
      "#FFF3CF",
      BRAND.yellow,
    ),
    `<div style="text-align:center"><img src="${asset("/images/brand/mascot-delivery.png")}" width="96" alt="" style="width:96px;height:auto;border:0"></div>`,
    paragraph("Didn't ask for this? No worries! Just ignore this email and nothing will change.", { size: 13 }),
  ].join("");

  return {
    subject: `${code} is your Toodle Store login code`,
    text: `You're almost in!\n\nYour Toodle Store login code is ${code}.\n\nIt's valid for 10 minutes and works only once. Please don't share it with anyone.\n\nDidn't ask for this? Just ignore this email.\n\n${SITE.tagline}`,
    html: emailLayout({ preheader: `Your login code is ${code}. Valid for 10 minutes.`, body }),
  };
}

interface OrderMail {
  orderNumber: string;
  name: string;
  total: number;
  shipping: number;
  codFee: number;
  items: { name: string; qty: number; unitPrice: number }[];
  address: { line1: string; city: string; state: string; pincode: string };
}

function totalRow(label: string, value: string, opts: { big?: boolean; color?: string } = {}) {
  const size = opts.big ? 18 : 15;
  const weight = opts.big ? "bold" : "normal";
  return `<tr><td style="padding:6px 0;font-family:${FONT};font-size:${size}px;font-weight:${weight};color:${opts.big ? BRAND.ink : BRAND.inkSoft}">${label}</td>
        <td align="right" style="padding:6px 0;font-family:${FONT};font-size:${size}px;font-weight:bold;color:${opts.color ?? BRAND.ink}">${value}</td></tr>`;
}

function itemsTable(o: OrderMail) {
  const rows = o.items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;font-family:${FONT};font-size:15px;color:${BRAND.ink}">${escapeHtml(i.name)} <span style="color:${BRAND.inkSoft}">× ${i.qty}</span></td>
        <td align="right" style="padding:8px 0;font-family:${FONT};font-size:15px;font-weight:bold;color:${BRAND.ink};white-space:nowrap">${formatPaise(i.unitPrice * i.qty)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}
    <tr><td style="padding:10px 0 4px;border-top:2px dashed ${BRAND.line};font-family:${FONT};font-size:15px;color:${BRAND.inkSoft}">Delivery</td>
        <td align="right" style="padding:10px 0 4px;border-top:2px dashed ${BRAND.line};font-family:${FONT};font-size:15px;color:${o.shipping ? BRAND.ink : BRAND.green};font-weight:bold">${o.shipping ? formatPaise(o.shipping) : "Free"}</td></tr>
    ${
      o.codFee
        ? totalRow("Cash on delivery charge", formatPaise(o.codFee)) +
          totalRow("Order total", formatPaise(o.total), { big: true }) +
          totalRow("Paid online", `−${formatPaise(o.codFee)}`, { color: BRAND.green }) +
          totalRow("Pay in cash on delivery", formatPaise(o.total - o.codFee), { big: true, color: BRAND.red })
        : totalRow("Total paid", formatPaise(o.total), { big: true })
    }
  </table>`;
}

export function orderConfirmedEmail(o: OrderMail): Email {
  const cashDue = o.total - o.codFee;
  const body = [
    heading(`Woohoo, ${firstName(o.name)}! Your order is confirmed 🎁`),
    paragraph(
      o.codFee
        ? `Thank you for shopping with us! We've received your ${formatPaise(o.codFee)} cash on delivery charge, so your order is confirmed. Please keep <strong style="color:${BRAND.ink}">${formatPaise(cashDue)}</strong> ready to pay when it arrives.`
        : `Thank you for shopping with us! We've received your payment and our elves are already getting your toys ready.`,
    ),
    panel(`<div style="text-align:center;font-size:14px;color:${BRAND.inkSoft}">Order number</div><div style="text-align:center;font-size:24px;font-weight:bold;letter-spacing:1px">${o.orderNumber}</div>`, "#DDECFD", BRAND.blue),
    panel(itemsTable(o)),
    paragraph(`🚚 Delivering to <strong style="color:${BRAND.ink}">${escapeHtml(`${o.address.line1}, ${o.address.city}, ${o.address.state} ${o.address.pincode}`)}</strong>`),
    paragraph(`We'll email you again when it's packed, shipped and delivered.`),
    button("Track my order", trackLink(o.orderNumber)),
  ].join("");

  return {
    subject: `🎉 Order ${o.orderNumber} confirmed! Your toys are on their way soon`,
    text: `Woohoo! Your order ${o.orderNumber} is confirmed${o.codFee ? "" : " and paid"}.\n\n${o.items.map((i) => `• ${i.name} × ${i.qty} = ${formatPaise(i.unitPrice * i.qty)}`).join("\n")}\n\nDelivery: ${o.shipping ? formatPaise(o.shipping) : "Free"}\n${
      o.codFee
        ? `Cash on delivery charge: ${formatPaise(o.codFee)}\nOrder total: ${formatPaise(o.total)}\nPaid online: ${formatPaise(o.codFee)}\nPay in cash on delivery: ${formatPaise(cashDue)}`
        : `Total paid: ${formatPaise(o.total)}`
    }\n\nDelivering to: ${o.address.line1}, ${o.address.city}, ${o.address.state} ${o.address.pincode}\n\nTrack your order: ${trackLink(o.orderNumber)}\n\nQuestions? WhatsApp us on ${SITE.phone}.`,
    html: emailLayout({ preheader: `Order ${o.orderNumber} is confirmed. We're getting your toys ready!`, body }),
  };
}

const STATUS_COPY: Record<string, { subject: string; title: string; text: string; color: string }> = {
  placed: { subject: "is confirmed! 🎉", title: "Your order is confirmed! 🎉", text: "Great news! We've confirmed your order and we're getting your toys ready.", color: BRAND.yellow },
  packed: { subject: "is packed and ready to roll 📦", title: "All packed and ready to roll! 📦", text: "Your toys are snugly packed and will be handed to the courier very soon.", color: BRAND.orange },
  shipped: { subject: "is on its way! 🚚", title: "Zoom zoom, it's on its way! 🚚", text: "Your parcel has left our store and is heading to you.", color: BRAND.blue },
  delivered: { subject: "has been delivered! 🎈", title: "Ta-da! Your order has arrived 🎈", text: "We hope the little one loves it! Thank you for choosing Toodle Store.", color: BRAND.green },
  cancelled: { subject: "has been cancelled", title: "Your order has been cancelled", text: "If this is unexpected or you have questions, WhatsApp us and we'll sort it out.", color: BRAND.red },
};

export function orderStatusEmail(o: { orderNumber: string; status: string; courier?: string | null; awbNumber?: string | null; trackingUrl?: string | null }): Email | null {
  const copy = STATUS_COPY[o.status];
  if (!copy) return null;
  const parcel =
    o.status === "shipped" && (o.courier || o.trackingUrl)
      ? panel(
          `<div style="text-align:center;font-size:15px">${o.courier ? `Courier: <strong>${escapeHtml(o.courier)}</strong>` : ""}${o.awbNumber ? ` · AWB <strong>${escapeHtml(o.awbNumber)}</strong>` : ""}</div>${o.trackingUrl ? button("Track my parcel", o.trackingUrl, BRAND.blue) : ""}`,
          "#DDECFD",
          BRAND.blue,
        )
      : "";
  const body = [
    `<div style="height:8px;border-radius:4px;background:${copy.color};margin:0 0 22px"></div>`,
    heading(copy.title),
    paragraph(copy.text),
    panel(`<div style="text-align:center;font-size:14px;color:${BRAND.inkSoft}">Order number</div><div style="text-align:center;font-size:22px;font-weight:bold;letter-spacing:1px">${o.orderNumber}</div>`),
    parcel,
    button("See my order", trackLink(o.orderNumber)),
  ].join("");

  return {
    subject: `Your Toodle Store order ${o.orderNumber} ${copy.subject}`,
    text: `${copy.title}\n\n${copy.text}\n\nOrder ${o.orderNumber}${o.trackingUrl ? `\nTrack the parcel: ${o.trackingUrl}` : ""}\n\nSee your order: ${trackLink(o.orderNumber)}`,
    html: emailLayout({ preheader: `${copy.title.replace(/[^\p{L}\p{N}\s!,'.]/gu, "").trim()} Order ${o.orderNumber}.`, body }),
  };
}

export function enquiryReceivedEmail(e: { fullName: string; phone: string }): Email {
  const body = [
    heading(`Thanks, ${firstName(e.fullName)}! We've got your enquiry 🙌`),
    paragraph("We're excited to help you stock up! Our wholesale team will call you within <strong style=\"color:#1D2B53\">24 hours</strong> with our price list."),
    panel(`<div style="text-align:center;font-size:15px">📞 We'll call you on <strong>${escapeHtml(e.phone)}</strong></div>`, "#E0F2E2", BRAND.green),
    paragraph("Can't wait? Chat with us right now on WhatsApp."),
    button("WhatsApp us", WHATSAPP_BULK_HREF, BRAND.green),
    paragraph(`Meanwhile, take a peek at our <a href="${siteLink("/b2b")}" style="color:${BRAND.blue};font-weight:bold">wholesale categories</a>.`, { size: 14 }),
  ].join("");

  return {
    subject: "🙌 We've got your Toodle Store wholesale enquiry!",
    text: `Hi ${e.fullName.split(" ")[0]},\n\nThank you for your enquiry! Our team will call you on ${e.phone} within 24 hours with our wholesale price list.\n\nNeed us sooner? WhatsApp ${SITE.phone}.\n\nToodle Store`,
    html: emailLayout({ preheader: "Our wholesale team will call you within 24 hours.", body, whatsapp: WHATSAPP_BULK_HREF }),
  };
}
