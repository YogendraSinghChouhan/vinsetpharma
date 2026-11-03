export const CATEGORY_LIMITS = {
  name: {
    min: 2,
    max: 60,
  },
} as const;

export const CATEGORY_CACHE_TAGS = {
  list: "categories:list",
  bySlug: (slug: string) => `categories:slug:${slug}`,
} as const;

export const CATEGORY_ROUTES = {
  adminCategories: "/admin/categories",
  adminCategoryNew: "/admin/categories/new",
  adminCategoryEdit: (id: string) => `/admin/categories/${id}/edit`,
  categoryDetail: (slug: string) => `/products/category/${slug}`,
} as const;
