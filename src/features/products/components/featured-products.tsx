import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { FEATURED_PRODUCTS_LIMIT } from "../constants";
import { getFeaturedProducts } from "../public-data";
import { ProductGrid } from "./product-grid";

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(FEATURED_PRODUCTS_LIMIT);

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="featured-products" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Featured Products"
            description="Explore our essential pharmaceutical formulations developed to meet high clinical standards."
          />

          <ProductGrid products={products} />

          <div className="flex justify-center pt-2">
            <Link
              href={ROUTES.products}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
