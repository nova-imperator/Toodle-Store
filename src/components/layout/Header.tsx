import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { CATEGORY_LINKS, QUICK_LINKS } from "@/config/navigation";
import { SearchBox } from "./SearchBox";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import { NavDropdowns } from "./NavDropdowns";
import styles from "./Header.module.css";

export function Header({ userName }: { userName: string | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.strip}>
        <div className={`container ${styles.stripInner}`}>
          <span>Free delivery across India on every order</span>
          <span className={styles.desk}>
            Questions? WhatsApp <a href={SITE.whatsappHref}>{SITE.phone}</a>
          </span>
        </div>
      </div>

      <div className={`container ${styles.bar}`}>
        <div className={styles.left}>
          <MobileMenu userName={userName} />
          <Link href="/" className={styles.logo} aria-label={`${SITE.name} home`}>
            <Image src="/images/brand/logo.webp" alt={SITE.name} width={520} height={489} priority />
          </Link>
        </div>
        <div className={styles.search}>
          <SearchBox />
        </div>
        <HeaderActions userName={userName} />
      </div>

      <nav className={styles.cats} aria-label="Shop">
        <div className={`container ${styles.catsInner}`}>
          <NavDropdowns />
          {QUICK_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav className={styles.chips} aria-label="Categories">
        {CATEGORY_LINKS.map((c) => (
          <Link key={c.href} href={c.href} data-color={c.color}>
            {c.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
