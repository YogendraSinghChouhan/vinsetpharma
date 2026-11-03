import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/site";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { CategoryListSkeleton } from "@/features/categories/components/category-list-skeleton";
import { CategorySortableList } from "@/features/categories/components/category-sortable-list";
import { listCategories } from "@/features/categories/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categories | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function CategoriesContent() {
  const categories = await listCategories();
  return <CategorySortableList initialCategories={categories} />;
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage pharmaceutical categories, display ordering, and category images."
        actions={
          <Link
            href={ROUTES.adminCategoryNew}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <IconPlus className="size-4 mr-1.5" aria-hidden="true" />
            <span>New Category</span>
          </Link>
        }
      />
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
