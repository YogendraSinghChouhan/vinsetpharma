import { Container } from "@/components/layout/container";
import { getPublicCategories } from "../public-data";
import { CategoriesCarousel } from "./categories-carousel";

export async function CategoriesSection() {
  const categories = await getPublicCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section
      id="product-categories"
      className="relative overflow-hidden bg-surface-tint py-14 sm:py-18 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(135deg,transparent_0%,transparent_48%,rgba(0,74,184,0.04)_48%,rgba(0,74,184,0.04)_50%,transparent_50%,transparent_100%),linear-gradient(45deg,transparent_0%,transparent_48%,rgba(0,74,184,0.03)_48%,rgba(0,74,184,0.03)_50%,transparent_50%,transparent_100%)] [background-size:72px_72px]"
        aria-hidden="true"
      />
      <Container>
        <CategoriesCarousel categories={categories} />
      </Container>
    </section>
  );
}
