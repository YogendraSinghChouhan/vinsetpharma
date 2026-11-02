export const POST_LIMITS = {
  title: {
    min: 5,
    max: 150,
  },
  slug: {
    min: 3,
    max: 100,
  },
  seoTitle: {
    max: 70,
  },
  seoDescription: {
    max: 170,
  },
  content: {
    max: 100_000,
  },
} as const;

export const ADMIN_POSTS_PAGE_SIZE = 20;
export const PUBLIC_POSTS_PAGE_SIZE = 9;
export const HOME_LATEST_POSTS_LIMIT = 6;

export const BLOG_CACHE_TAGS = {
  list: "blogs:list",
  bySlug: (slug: string) => `blogs:slug:${slug}`,
} as const;

export const BLOG_ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
] as const;

export const BLOG_ALLOWED_SCHEMES = ["http", "https", "mailto"] as const;
