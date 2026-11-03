import type { BrickColor } from "@/config/catalogue";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  mrp: number;
  salePrice: number;
  image: string;
  imageAlt: string;
  ageLabel: string | null;
  color: BrickColor;
  inStock: boolean;
  isNew: boolean;
}

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc";

export interface ListingFilters {
  category?: string;
  age?: string;
  brand?: string;
  q?: string;
  ages?: string[];
  brands?: string[];
  min?: number;
  max?: number;
  flag?: "best" | "new" | "deal";
  sort?: SortKey;
  page?: number;
}

export interface FacetOption {
  slug: string;
  name: string;
  count: number;
}

export interface ListingResult {
  items: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  facets: { ages: FacetOption[]; brands: FacetOption[] };
}
