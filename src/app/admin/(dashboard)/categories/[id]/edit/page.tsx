import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryFormSkeleton } from "@/features/categories/components/category-form-skeleton";
import { getCategoryById } from "@/features/categories/data";
import { categoryIdSchema } from "@/features/categories/validation";

export const metadata: Metadata = {
  title: "Edit Category | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

async function EditCategoryContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = categoryIdSchema.safeParse(id);
  if (!parsed.success) {
    notFound();
  }

  const category = await getCategoryById(parsed.data);
  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} />;
}

export default function AdminEditCategoryPage({
  params,
}: EditCategoryPageProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Edit Category"
        description="Update category name and optional thumbnail image."
      />
      <Suspense fallback={<CategoryFormSkeleton />}>
        <EditCategoryContent params={params} />
      </Suspense>
    </div>
  );
}
