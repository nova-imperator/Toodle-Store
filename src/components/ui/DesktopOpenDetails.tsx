"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** A <details> that starts open on desktop and closed on phones. */
export function DesktopOpenDetails({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref.current && window.matchMedia("(min-width: 900px)").matches) ref.current.open = true;
  }, []);
  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
