import "server-only";

import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db/client";
import { categories } from "@/features/categories/schema";
import { products } from "@/features/products/schema";

const SEARCH_RESULT_LIMIT = 12;

export type SearchResult = {
  id: string;
  type: "product" | "category";
  title: string;
  description: string;
  href: string;
};

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function searchPublicContent(
  query: string,
): Promise<SearchResult[]> {
  const pattern = `%${escapeLikePattern(query)}%`;

  const [productResults, categoryResults] = await Promise.all([
    db
      .select({
        id: products.id,
        slug: products.slug,
        title: products.title,
        description: products.tagline,
      })
      .from(products)
      .where(
        and(
          eq(products.published, true),
          or(
            ilike(products.title, pattern),
            ilike(products.tagline, pattern),
            ilike(products.description, pattern),
            ilike(products.slug, pattern),
          ),
        ),
      )
      .orderBy(asc(products.sortOrder), asc(products.title))
      .limit(SEARCH_RESULT_LIMIT),
    db
      .select({
        id: categories.id,
        slug: categories.slug,
        title: categories.name,
      })
      .from(categories)
      .where(
        or(ilike(categories.name, pattern), ilike(categories.slug, pattern)),
      )
      .orderBy(asc(categories.sortOrder), asc(categories.name))
      .limit(SEARCH_RESULT_LIMIT),
  ]);

  return [
    ...productResults.map((result) => ({
      ...result,
      type: "product" as const,
      href: `/products/${result.slug}`,
    })),
    ...categoryResults.map((result) => ({
      id: result.id,
      type: "category" as const,
      title: result.title,
      description: "Product category",
      href: `/products/category/${result.slug}`,
    })),
  ];
}
