import type { Metadata } from "next";
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
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Add New Category"
        description="Create a new category to group and showcase pharmaceutical products."
      />
      <CategoryForm />
    </div>
  );
}
