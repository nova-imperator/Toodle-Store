import { NextResponse, type NextRequest } from "next/server";

// Owner (28 Nov 2026): the site must only be seen on its own domain. On the live (production) deployment,
// any *.vercel.app address permanently redirects to the same page on NEXT_PUBLIC_SITE_URL
// (https://www.toodlestore.in). Preview deployments are left alone so they can still be tested.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const target = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production" && host.endsWith(".vercel.app") && target && !target.includes(host)) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, target);
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Everything except static build files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
