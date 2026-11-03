import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { listCategoryOptions } from "@/features/categories/data";
import { ProductForm } from "@/features/products/components/product-form";
import { ProductFormSkeleton } from "@/features/products/components/product-form-skeleton";

export const metadata: Metadata = {
  title: "New Product | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function NewProductContent() {
  const categories = await listCategoryOptions();
  return <ProductForm categories={categories} />;
}

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Add New Product"
        description="Create a new pharmaceutical product entry for the showcase catalog."
      />
      <Suspense fallback={<ProductFormSkeleton />}>
        <NewProductContent />
      </Suspense>
    </div>
  );
}
