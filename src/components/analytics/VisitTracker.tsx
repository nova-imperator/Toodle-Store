"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Counts a page view for the admin dashboard on every page change (see /api/track). */
export function VisitTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    last.current = pathname;
    const body = JSON.stringify({ path: pathname, referrer: document.referrer || undefined });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  }, [pathname]);

  return null;
}
