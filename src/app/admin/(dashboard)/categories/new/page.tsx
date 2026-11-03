import type { Metadata } from "next";
import { AdminCreatePageLayout } from "@/features/admin-shell/components/admin-create-page-layout";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { CategoryForm } from "@/features/categories/components/category-form";

export const metadata: Metadata = {
  title: "New Category | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewCategoryPage() {
  return (
    <AdminCreatePageLayout>
      <AdminPageHeader
        title="Add New Category"
        description="Create a new category to group and showcase pharmaceutical products."
      />
      <div className="mx-auto w-full max-w-4xl">
        <CategoryForm />
      </div>
    </AdminCreatePageLayout>
  );
}
