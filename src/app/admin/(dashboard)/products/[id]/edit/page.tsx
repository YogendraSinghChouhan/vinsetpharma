import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { ProductForm } from "@/features/products/components/product-form";
import { ProductFormSkeleton } from "@/features/products/components/product-form-skeleton";
import { getProductById } from "@/features/products/data";
import { productIdSchema } from "@/features/products/validation";

export const metadata: Metadata = {
  title: "Edit Product | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function EditProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = productIdSchema.safeParse(id);
  if (!parsed.success) {
    notFound();
  }

  const product = await getProductById(parsed.data);
  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}

export default function AdminEditProductPage({ params }: EditProductPageProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Edit Product"
        description="Update pharmaceutical specifications, tagline, or image."
      />
      <Suspense fallback={<ProductFormSkeleton />}>
        <EditProductContent params={params} />
      </Suspense>
    </div>
  );
}
