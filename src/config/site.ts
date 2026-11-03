export const SITE = {
  name: "Toodle Store",
  tagline: "Every Child Deserves One!",
  // Falls back to Vercel's production URL so preview deployments get correct absolute links.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  phone: "+91 91379 17819",
  phoneHref: "tel:+919137917819",
  whatsappHref: "https://wa.me/919137917819",
  instagram: "@toodlestore_india",
  instagramHref: "https://www.instagram.com/toodlestore_india/",
  email: "hello@toodlestore.in",
  legalName: "Atreya Innovations Pvt Ltd",
  deliveryDays: { min: 3, max: 7 },
};

export const POLICY_LINKS = [
  { label: "Shipping policy", href: "/shipping-policy" },
  { label: "Return policy", href: "/return-policy" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];
