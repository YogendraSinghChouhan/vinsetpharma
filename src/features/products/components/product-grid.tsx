import { cn } from "@/lib/utils";
import type { PublicProduct } from "../public-data";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: PublicProduct[];
  className?: string;
  priorityFirstRow?: boolean;
};

export function ProductGrid({
  products,
  className,
  priorityFirstRow = true,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={priorityFirstRow && index < 3}
        />
      ))}
    </div>
  );
}
