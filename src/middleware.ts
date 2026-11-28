import { NextResponse, type NextRequest } from "next/server";

// Owner (28 Nov 2026): the site must only be seen on its own domain. The production vercel.app address
// permanently redirects to the same page on the real domain. Preview deployments (other *.vercel.app
// names) are left alone so they can still be tested.
const OLD_HOSTS = new Set(["toodle-store.vercel.app"]);
const TARGET = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toodlestore.in";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (OLD_HOSTS.has(host)) {
    return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, TARGET), 308);
  }
  return NextResponse.next();
}

export const config = {
  // Everything except static build files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
