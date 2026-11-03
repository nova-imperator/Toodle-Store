import { SITE } from "@/config/site";

const abs = (path: string) => new URL(path, SITE.url).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs("/images/brand/logo.png"),
    contactPoint: { "@type": "ContactPoint", telephone: SITE.phone, contactType: "customer service", areaServed: "IN" },
    sameAs: [SITE.instagramHref],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function productLd(p: {
  name: string;
  slug: string;
  sku: string;
  description: string;
  images: string[];
  brand: string | null;
  salePrice: number;
  inStock: boolean;
  rating?: { value: number; count: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.description,
    image: p.images.map(abs),
    ...(p.brand && { brand: { "@type": "Brand", name: p.brand } }),
    offers: {
      "@type": "Offer",
      url: abs(`/product/${p.slug}`),
      priceCurrency: "INR",
      price: (p.salePrice / 100).toFixed(2),
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      },
    },
    ...(p.rating && p.rating.count > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.value.toFixed(1), reviewCount: p.rating.count },
    }),
  };
}
