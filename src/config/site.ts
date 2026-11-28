export const SITE = {
  name: "Toodle Store",
  tagline: "Every Child Deserves One!",
  // Falls back to Vercel's production URL so preview deployments get correct absolute links.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  phone: "+91 99878 83903",
  phoneHref: "tel:+919987883903",
  whatsappHref: "https://wa.me/919987883903",
  instagram: "@toodlestore_india",
  instagramHref: "https://www.instagram.com/toodlestore_india/",
  facebookHref: "https://www.facebook.com/share/1LT8iDaL28/",
  email: "toodlestoreindia@gmail.com",
  // Company name intentionally not shown anywhere on the site (owner, 17 Nov 2026).
  deliveryDays: { min: 3, max: 7 },
};

/** Pre-filled WhatsApp messages, so the team can tell shoppers and bulk buyers apart (owner, 14 Nov 2026). */
export const WHATSAPP_TEXT = {
  retail: "Hi Toodle Store! I'd like some help with toys on your website.",
  bulk: "Hi Toodle Store! I'm interested in buying toys in bulk (wholesale). Please share your price list and details.",
};

export function whatsappLink(text: string) {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_RETAIL_HREF = whatsappLink(WHATSAPP_TEXT.retail);
export const WHATSAPP_BULK_HREF = whatsappLink(WHATSAPP_TEXT.bulk);

export const POLICY_LINKS = [
  { label: "Shipping policy", href: "/shipping-policy" },
  { label: "Returns & refunds", href: "/return-policy" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];
