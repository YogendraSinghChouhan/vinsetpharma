import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import {
  getAdminPageHref,
  parseAdminPageParam,
} from "@/features/admin-shell/pagination-utils";
import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";
import { ProductSortableList } from "@/features/products/components/product-sortable-list";
import { ADMIN_PRODUCTS_PAGE_SIZE } from "@/features/products/constants";
import { listProducts } from "@/features/products/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseAdminPageParam(resolvedParams.page);

  const { items, total, totalPages, publishedCount, featuredCount } =
    await listProducts({
      page,
      pageSize: ADMIN_PRODUCTS_PAGE_SIZE,
    });

  if (page > totalPages && totalPages > 0) {
    redirect(getAdminPageHref(ROUTES.adminProducts, totalPages));
  }

  return (
    <ProductSortableList
      initialProducts={items}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      publishedCount={publishedCount}
      featuredCount={featuredCount}
    />
  );
}

export default function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your pharmaceutical catalog, display order, and publication status."
        actions={
          <Link
            href={ROUTES.adminProductNew}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
            <span>New Product</span>
          </Link>
        }
      />
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
