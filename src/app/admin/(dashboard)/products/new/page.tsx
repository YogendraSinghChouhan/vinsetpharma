import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { ProductForm } from "@/features/products/components/product-form";

export const metadata: Metadata = {
  title: "New Product | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Add New Product"
        description="Create a new pharmaceutical product entry for the showcase catalog."
      />
      <ProductForm />
    </div>
  );
}
