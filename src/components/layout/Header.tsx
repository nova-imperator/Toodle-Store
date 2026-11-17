import Link from "next/link";
import { SITE, WHATSAPP_RETAIL_HREF } from "@/config/site";
import { SiteLogo } from "./SiteLogo";
import { FREE_SHIPPING_LABEL } from "@/config/shipping";
import { CATEGORY_LINKS } from "@/config/navigation";
// Used by the hidden desktop menu bar below; restore these imports together with it.
// import { QUICK_LINKS } from "@/config/navigation";
// import { NavDropdowns } from "./NavDropdowns";
import { SearchBox } from "./SearchBox";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

export function Header({ userName, userAvatar = null }: { userName: string | null; userAvatar?: string | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.strip}>
        <div className={`container ${styles.stripInner}`}>
          {/* "We deliver only within India" removed from the strip (owner, 14 Nov 2026); it still shows on the home page and checkout. */}
          <span>{FREE_SHIPPING_LABEL}</span>
          <span className={styles.desk}>
            Questions? WhatsApp <a href={WHATSAPP_RETAIL_HREF} target="_blank" rel="noopener">{SITE.phone}</a>
          </span>
        </div>
      </div>

      <div className={`container ${styles.bar}`}>
        <div className={styles.left}>
          <MobileMenu userName={userName} userAvatar={userAvatar} />
          <SiteLogo className={styles.logo} />
        </div>
        <div className={styles.search}>
          <SearchBox />
        </div>
        <HeaderActions userName={userName} userAvatar={userAvatar} />
      </div>

      {/* Desktop menu bar (Shop by Category, Shop by Age, Offers, New arrivals, Best sellers) hidden on owner's request, 14 Nov 2026.
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
      */}

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
