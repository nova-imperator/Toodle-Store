import { AGE_GROUPS, CATEGORIES } from "./catalogue";

export const CATEGORY_LINKS = CATEGORIES.map((c) => ({
  label: c.name,
  href: `/category/${c.slug}`,
  image: `/images/categories/${c.slug}.webp`,
  color: c.color,
}));

export const AGE_LINKS = AGE_GROUPS.map((a) => ({
  label: a.name,
  short: a.short,
  href: `/age/${a.slug}`,
  image: `/images/ages/${a.slug}.webp`,
  color: a.color,
}));

export const QUICK_LINKS = [
  { label: "Brands", href: "/brands" },
  { label: "Offers", href: "/shop?flag=deal" },
  { label: "New arrivals", href: "/shop?flag=new" },
  { label: "Best sellers", href: "/shop?flag=best" },
];
