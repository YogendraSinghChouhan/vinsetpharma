import { notFound } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/config/site";
import { PageHeader } from "@/features/marketing/components/page-header";
import { PAGE_META } from "@/features/marketing/content";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductsPagination } from "@/features/products/components/products-pagination";
import { PUBLIC_PRODUCTS_PAGE_SIZE } from "@/features/products/constants";
import { getPublishedProductsPage } from "@/features/products/public-data";
import { createPageMetadata } from "@/lib/metadata";

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parsePageParam(rawPage: string | string[] | undefined): number {
  if (rawPage === undefined) return 1;
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  if (!value) return 1;
  const result = z.coerce.number().int().positive().safeParse(value);
  if (!result.success || String(result.data) !== value) {
    return 1;
  }
  return result.data;
}

export const instant = false;

export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  if (page > 1) {
    const { totalPages } = await getPublishedProductsPage({
      page: 1,
      pageSize: PUBLIC_PRODUCTS_PAGE_SIZE,
    });
    if (page > totalPages) {
      notFound();
    }
  }

  const title = page > 1 ? `Our Products (Page ${page})` : "Our Products";
  const path = page > 1 ? `${ROUTES.products}?page=${page}` : ROUTES.products;

  return createPageMetadata({
    title,
    description: PAGE_META.home.description,
    path,
  });
}

async function ProductsCatalog({ page }: { page: number }) {
  const { items, totalItems, totalPages } = await getPublishedProductsPage({
    page,
    pageSize: PUBLIC_PRODUCTS_PAGE_SIZE,
  });

  if (totalItems === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">No products are currently listed.</p>
        <p className="mt-2 text-sm">
          Contact us by phone or email for product information.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={items} />
      <ProductsPagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = parsePageParam(resolvedParams.page);

  // Validate page bounds BEFORE streaming begins so invalid pages yield a real HTTP 404
  if (page > 1) {
    const { totalPages } = await getPublishedProductsPage({
      page: 1,
      pageSize: PUBLIC_PRODUCTS_PAGE_SIZE,
    });
    if (page > totalPages) {
      notFound();
    }
  }

  return (
    <>
      <PageHeader
        title="Our Products"
        description={PAGE_META.home.description}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Our Products" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <ProductsCatalog page={page} />
      </div>
    </>
  );
}
