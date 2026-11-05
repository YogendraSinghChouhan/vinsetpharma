import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES } from "@/config/site";
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
    description: `Browse ${category.name} products marketed under the Vinset name.`,
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
        description={`Browse ${category.name.toLowerCase()} products marketed under the Vinset name.`}
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
              No products are currently listed in this category.
            </p>
            <p className="mt-2 text-sm">
              Browse all products or contact us for product information.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  );
}
