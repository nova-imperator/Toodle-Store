import Link from "next/link";
import { BUDGETS } from "@/config/catalogue";
import { DesktopOpenDetails } from "@/components/ui/DesktopOpenDetails";
import { toggleInList, withParams, type SearchParams } from "@/lib/listingParams";
import type { FacetOption, ListingFilters } from "@/types/catalogue";
import styles from "./Filters.module.css";

interface Props {
  basePath: string;
  sp: SearchParams;
  filters: ListingFilters;
  facets: { ages: FacetOption[]; brands: FacetOption[] };
  hide?: ("ages" | "brands")[];
}

function Option({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  return (
    <li>
      <Link href={href} className={styles.option} aria-current={active ? "true" : undefined} scroll={false} rel="nofollow">
        <span className={styles.box} aria-hidden="true" />
        <span className={styles.text}>{label}</span>
        {count != null && <span className={styles.count}>{count}</span>}
      </Link>
    </li>
  );
}

export function Filters({ basePath, sp, filters, facets, hide = [] }: Props) {
  const activeCount = (filters.ages?.length ?? 0) + (filters.brands?.length ?? 0) + (filters.max ? 1 : 0);
  const clear = withParams(sp, { ages: null, brands: null, max: null, min: null });

  return (
    <DesktopOpenDetails className={styles.filters}>
      <summary className={styles.summary}>
        Filters {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
      </summary>

      <div className={styles.groups}>
        <fieldset className={styles.group}>
          <legend>Price</legend>
          <ul>
            {BUDGETS.map((b) => (
              <Option
                key={b.max}
                label={b.label}
                active={filters.max === b.max}
                href={`${basePath}${withParams(sp, { max: filters.max === b.max ? null : String(b.max) })}`}
              />
            ))}
          </ul>
        </fieldset>

        {!hide.includes("ages") && facets.ages.length > 0 && (
          <fieldset className={styles.group}>
            <legend>Age</legend>
            <ul>
              {facets.ages.map((a) => (
                <Option
                  key={a.slug}
                  label={a.name}
                  count={a.count}
                  active={filters.ages?.includes(a.slug) ?? false}
                  href={`${basePath}${withParams(sp, { ages: toggleInList(sp, "ages", a.slug) })}`}
                />
              ))}
            </ul>
          </fieldset>
        )}

        {!hide.includes("brands") && facets.brands.length > 0 && (
          <fieldset className={styles.group}>
            <legend>Brand</legend>
            <ul>
              {facets.brands.map((b) => (
                <Option
                  key={b.slug}
                  label={b.name}
                  count={b.count}
                  active={filters.brands?.includes(b.slug) ?? false}
                  href={`${basePath}${withParams(sp, { brands: toggleInList(sp, "brands", b.slug) })}`}
                />
              ))}
            </ul>
          </fieldset>
        )}

        {activeCount > 0 && (
          <Link href={`${basePath}${clear}`} className={styles.clear} scroll={false}>
            Clear all filters
          </Link>
        )}
      </div>
    </DesktopOpenDetails>
  );
}
