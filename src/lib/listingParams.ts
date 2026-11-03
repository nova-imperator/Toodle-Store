import type { ListingFilters, SortKey } from "@/types/catalogue";

export type SearchParams = Record<string, string | string[] | undefined>;

const SORTS: SortKey[] = ["popular", "newest", "price-asc", "price-desc"];
const FLAGS = ["best", "new", "deal"] as const;

const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? v.split(",") : []).filter(Boolean).slice(0, 10);
const num = (v: string | string[] | undefined) => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
};
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads listing filters from the URL. Unknown values are ignored. */
export function parseListingParams(sp: SearchParams): ListingFilters {
  const sort = one(sp.sort) as SortKey | undefined;
  const flag = one(sp.flag) as (typeof FLAGS)[number] | undefined;
  return {
    q: one(sp.q)?.slice(0, 80),
    ages: list(sp.ages),
    brands: list(sp.brands),
    min: num(sp.min),
    max: num(sp.max),
    sort: sort && SORTS.includes(sort) ? sort : undefined,
    flag: flag && FLAGS.includes(flag) ? flag : undefined,
    page: num(sp.page),
  };
}

/** Builds a query string from current params with some keys changed (null removes a key). */
export function withParams(sp: SearchParams, changes: Record<string, string | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const value = Array.isArray(v) ? v.join(",") : v;
    if (value && k !== "page") q.set(k, value);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v === null || v === "") q.delete(k);
    else q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function toggleInList(sp: SearchParams, key: string, value: string): string | null {
  const current = list(sp[key]);
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return next.length ? next.join(",") : null;
}
