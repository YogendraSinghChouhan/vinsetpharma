import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES, SITE_NAME } from "@/config/site";
import { CATEGORY_ROUTES } from "@/features/categories/constants";
import {
  getPublicCategoryBySlug,
  getPublishedCategorySlugs,
  getPublishedProductsForCategory,
} from "@/features/categories/public-data";
import { PageHeader } from "@/features/marketing/components/page-header";
import { ProductGrid } from "@/features/products/components/product-grid";
import { createPageMetadata } from "@/lib/metadata";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    return createPageMetadata({
      title: "Category Not Found",
      description: "The requested product category could not be found.",
      path: `${ROUTES.products}/category/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${category.name} | Products`,
    description: `Explore pharmaceutical formulations in ${category.name} from ${SITE_NAME}.`,
    path: CATEGORY_ROUTES.categoryDetail(slug),
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getPublishedProductsForCategory(category.id);

  return (
    <>
      <PageHeader
        title={category.name}
        description={`Explore our quality formulations in ${category.name.toLowerCase()}.`}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Our Products", href: ROUTES.products },
          { label: category.name },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">
              No products found in this category yet.
            </p>
            <p className="mt-2 text-sm">
              Please check back soon or browse all products in our catalog.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  );
}
