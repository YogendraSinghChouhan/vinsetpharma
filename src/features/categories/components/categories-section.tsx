import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { AutoCarousel } from "@/components/carousel/auto-carousel";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { getPublicCategories } from "../public-data";
import { CategoryCard } from "./category-card";

export async function CategoriesSection() {
  const categories = await getPublicCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section
      id="product-categories"
      className="py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <SectionHeading
            title="Browse by category"
            description="Explore our specialized pharmaceutical portfolio organized by therapeutic dosage form."
          />

          <AutoCarousel
            ariaLabel="Product categories showcase"
            slideClassName="w-[82%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            gapClassName="gap-4 sm:gap-6"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                priority={index === 0}
              />
            ))}
          </AutoCarousel>

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
