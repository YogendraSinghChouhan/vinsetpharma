import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";
import { ProductSortableList } from "@/features/products/components/product-sortable-list";
import { listProducts } from "@/features/products/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProductsContent() {
  const products = await listProducts();
  return <ProductSortableList initialProducts={products} />;
}

export default function AdminProductsPage() {
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
        <ProductsContent />
      </Suspense>
    </div>
  );
}
