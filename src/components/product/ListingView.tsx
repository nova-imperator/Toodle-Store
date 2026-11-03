import Link from "next/link";
import type { ReactNode } from "react";
import { listProducts } from "@/server/services/catalogue";
import { parseListingParams, withParams, type SearchParams } from "@/lib/listingParams";
import type { ListingFilters } from "@/types/catalogue";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "./ProductGrid";
import { Filters } from "./Filters";
import { SortSelect } from "./SortSelect";
import styles from "./ListingView.module.css";

interface Props {
  basePath: string;
  title: string;
  intro?: string | null;
  color?: string;
  crumbs: { name: string; path: string }[];
  fixed: ListingFilters;
  searchParams: SearchParams;
  hide?: ("ages" | "brands")[];
  aside?: ReactNode;
}

export async function ListingView({ basePath, title, intro, color = "blue", crumbs, fixed, searchParams, hide, aside }: Props) {
  const filters = { ...parseListingParams(searchParams), ...fixed };
  const result = await listProducts(filters);

  return (
    <div data-color={color}>
      <header className={styles.band}>
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <div className={styles.head}>
            <div>
              <h1>{title}</h1>
              {intro && <p className={styles.intro}>{intro}</p>}
            </div>
            {aside}
          </div>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.side}>
          <Filters basePath={basePath} sp={searchParams} filters={filters} facets={result.facets} hide={hide} />
        </aside>

        <section aria-label="Products">
          <div className={styles.toolbar}>
            <p className={styles.count} aria-live="polite">
              {result.total} {result.total === 1 ? "toy" : "toys"}
            </p>
            <SortSelect />
          </div>

          {result.items.length ? (
            <ProductGrid products={result.items} />
          ) : (
            <EmptyState
              title="No toys match these filters"
              text="Try removing a filter or two, or browse everything in the shop."
              action={<ButtonLink href={basePath}>Clear filters</ButtonLink>}
            />
          )}

          {result.pageCount > 1 && (
            <nav className={styles.pages} aria-label="Pages">
              {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`${basePath}${withParams(searchParams, { page: p === 1 ? null : String(p) })}`} aria-current={p === result.page ? "page" : undefined}>
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
