import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";

/** Horizontal Toodle Store logo used in the store and B2B headers. */
export function SiteLogo({ href = "/", className, label }: { href?: string; className?: string; label?: string }) {
  return (
    <Link href={href} className={className} aria-label={label ?? `${SITE.name} home`}>
      <Image src="/images/brand/logo-wide.webp" alt={SITE.name} width={502} height={160} priority />
    </Link>
  );
}
