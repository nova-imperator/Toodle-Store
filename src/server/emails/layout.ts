import "server-only";
import { SITE, WHATSAPP_RETAIL_HREF } from "@/config/site";

// Email HTML: tables + inline styles only, so it renders in Gmail, Outlook and phone mail apps.

export const BRAND = {
  red: "#E8382D",
  blue: "#1F7FE0",
  yellow: "#FFC72C",
  green: "#3FA34D",
  orange: "#FF8A1E",
  ink: "#1D2B53",
  inkSoft: "#4F5B7A",
  paper: "#FFF8EA",
  card: "#FFFDF8",
  line: "#EADFC8",
};

const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";

/** Images must load from a public URL, so local development uses the live site's copies. */
const ASSET_BASE = process.env.EMAIL_ASSET_URL || (SITE.url.startsWith("http://localhost") ? "https://toodle-store.vercel.app" : SITE.url);
export const asset = (path: string) => `${ASSET_BASE}${path}`;
export const siteLink = (path: string) => `${SITE.url}${path}`;

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Row of brick-coloured studs, the brand's signature divider. */
export function studs(size = 12) {
  const colors = [BRAND.red, BRAND.yellow, BRAND.blue, BRAND.green, BRAND.orange];
  return colors
    // White ring keeps the yellow stud visible on the yellow header.
    .map((c) => `<td style="padding:0 3px"><div style="width:${size}px;height:${size}px;border-radius:50%;background:${c};border:2px solid #ffffff;font-size:0;line-height:0">&nbsp;</div></td>`)
    .join("");
}

export function button(label: string, href: string, color = BRAND.red, text = "#ffffff") {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto"><tr><td style="border-radius:14px;background:${color};box-shadow:0 4px 0 rgba(0,0,0,.18)">
    <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:17px;font-weight:bold;color:${text};text-decoration:none;border-radius:14px">${label}</a>
  </td></tr></table>`;
}

export function heading(text: string) {
  return `<h1 style="margin:0 0 12px;font-family:${FONT};font-size:28px;line-height:1.2;color:${BRAND.ink};text-align:center">${text}</h1>`;
}

export function paragraph(html: string, opts: { center?: boolean; size?: number; color?: string } = {}) {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:${opts.size ?? 16}px;line-height:1.6;color:${opts.color ?? BRAND.inkSoft};${opts.center === false ? "" : "text-align:center;"}">${html}</p>`;
}

/** A soft coloured box, used for codes, notes and summaries. */
export function panel(html: string, bg = BRAND.paper, border = BRAND.line) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px"><tr><td style="padding:18px 20px;border:2px solid ${border};border-radius:18px;background:${bg};font-family:${FONT};color:${BRAND.ink}">${html}</td></tr></table>`;
}

/** Wraps content in the Toodle Store email shell (logo header, card, cheerful footer). */
/** `whatsapp`: footer WhatsApp link; defaults to the shopper message, wholesale emails pass the bulk one. */
export function emailLayout({ preheader, body, whatsapp }: { preheader: string; body: string; whatsapp?: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Toodle Store</title></head>
<body style="margin:0;padding:0;background:${BRAND.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.paper}">
<tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:22px 20px 18px;background:${BRAND.yellow};border-radius:24px 24px 0 0">
      <a href="${siteLink("/")}"><img src="${asset("/images/brand/logo-wide.png")}" width="220" alt="Toodle Store" style="display:block;width:220px;max-width:70%;height:auto;border:0"></a>
    </td></tr>
    <tr><td align="center" style="background:${BRAND.yellow};padding:0 0 14px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${studs()}</tr></table></td></tr>
    <tr><td style="padding:32px 28px 24px;background:${BRAND.card};border:3px solid ${BRAND.yellow};border-top:0;border-radius:0 0 24px 24px">
      ${body}
    </td></tr>
    <tr><td align="center" style="padding:22px 12px 6px;font-family:${FONT};font-size:18px;font-weight:bold;color:${BRAND.red}">${SITE.tagline} 🧸</td></tr>
    <tr><td align="center" style="padding:4px 12px;font-family:${FONT};font-size:14px;color:${BRAND.inkSoft}">
      <a href="${siteLink("/shop")}" style="color:${BRAND.blue};font-weight:bold;text-decoration:none">Shop toys</a> &nbsp;·&nbsp;
      <a href="${siteLink("/track-order")}" style="color:${BRAND.blue};font-weight:bold;text-decoration:none">Track an order</a> &nbsp;·&nbsp;
      <a href="${whatsapp ?? WHATSAPP_RETAIL_HREF}" style="color:${BRAND.green};font-weight:bold;text-decoration:none">WhatsApp ${SITE.phone}</a> &nbsp;·&nbsp;
      <a href="${SITE.instagramHref}" style="color:${BRAND.red};font-weight:bold;text-decoration:none">${SITE.instagram}</a> &nbsp;·&nbsp;
      <a href="${SITE.facebookHref}" style="color:${BRAND.blue};font-weight:bold;text-decoration:none">Facebook</a>
    </td></tr>
    <tr><td align="center" style="padding:10px 12px 0;font-family:${FONT};font-size:12px;color:#8a93ab">${SITE.name}. We deliver only within India.</td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}
