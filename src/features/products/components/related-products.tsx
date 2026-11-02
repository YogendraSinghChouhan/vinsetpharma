import { RELATED_PRODUCTS_LIMIT } from "../constants";
import { getRelatedProducts } from "../public-data";
import { ProductGrid } from "./product-grid";

type RelatedProductsSectionProps = {
  excludeId: string;
};

export async function RelatedProductsSection({
  excludeId,
}: RelatedProductsSectionProps) {
  const products = await getRelatedProducts(excludeId, RELATED_PRODUCTS_LIMIT);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t pt-12 sm:mt-20 sm:pt-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Related Products
      </h2>
      <ProductGrid products={products} priorityFirstRow={false} />
    </section>
  );
}
