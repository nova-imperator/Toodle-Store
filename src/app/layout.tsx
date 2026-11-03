import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/config/site";
import { isDemoMode } from "@/config/demo";
import "@/styles/globals.css";

// Self-hosted variable fonts (SIL OFL, see src/assets/fonts).
const baloo = localFont({ src: "../assets/fonts/baloo-2-latin-wght.woff2", weight: "400 800", variable: "--font-baloo", display: "swap" });
const nunito = localFont({ src: "../assets/fonts/nunito-latin-wght.woff2", weight: "200 1000", variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Toodle Store – Buy Toys Online in India", template: "%s | Toodle Store" },
  description: "Toys for every age from ₹49: RC cars, soft toys, dolls, puzzles, educational and musical toys. Free delivery across India.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_IN", images: ["/images/brand/logo.png"] },
};

export const viewport: Viewport = {
  themeColor: "#FFF8EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        {isDemoMode() && <p className="demo-banner">Demo site for review: payments are simulated and no real orders are placed.</p>}
        {children}
      </body>
    </html>
  );
}
