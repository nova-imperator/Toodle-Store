import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/config/site";
import { OG_IMAGE } from "@/lib/seo";
import "@/styles/globals.css";

// Self-hosted variable fonts (SIL OFL, see src/assets/fonts).
const baloo = localFont({ src: "../assets/fonts/baloo-2-latin-wght.woff2", weight: "400 800", variable: "--font-baloo", display: "swap" });
const nunito = localFont({ src: "../assets/fonts/nunito-latin-wght.woff2", weight: "200 1000", variable: "--font-nunito", display: "swap" });

const DEFAULT_DESCRIPTION =
  "Toys for every age: educational, musical and remote control toys, dollhouses and more. Pay online or cash on delivery, free delivery on orders of ₹999+.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: "Toodle Store – Buy Toys Online in India", template: "%s | Toodle Store" },
  description: DEFAULT_DESCRIPTION,
  // Defaults for any page that doesn't set its own (see src/lib/seo.ts for per-page SEO).
  openGraph: { siteName: SITE.name, type: "website", locale: "en_IN", images: [{ url: OG_IMAGE.store, width: 1200, height: 630, alt: "Toodle Store toys" }] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.store] },
  formatDetection: { telephone: false, email: false, address: false },
  // Google Search Console: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the code Google gives you.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#FFF8EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${baloo.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
