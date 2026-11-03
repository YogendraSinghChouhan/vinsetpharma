export const PRODUCT_LIMITS = {
  title: {
    min: 2,
    max: 120,
  },
  tagline: {
    max: 160,
  },
  description: {
    max: 5000,
  },
} as const;

export const PUBLIC_PRODUCTS_PAGE_SIZE = 12;
export const ADMIN_PRODUCTS_PAGE_SIZE = 20;
export const FEATURED_PRODUCTS_LIMIT = 8;
export const RELATED_PRODUCTS_LIMIT = 4;

export const PRODUCT_CACHE_TAGS = {
  list: "products:list",
  bySlug: (slug: string) => `products:slug:${slug}`,
} as const;
