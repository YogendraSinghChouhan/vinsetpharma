import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { getPublicCategories } from "../public-data";
import { CategoryCard } from "./category-card";

export async function CategoriesSection() {
  const categories = await getPublicCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      id="product-categories"
      className="py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Product Categories"
            description="Explore our specialized pharmaceutical portfolio organized by therapeutic dosage form."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href={ROUTES.products}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
