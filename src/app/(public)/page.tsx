import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { ROUTES, SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { LatestBlogsSection } from "@/features/blogs/components/latest-blogs";
import { CategoriesSection } from "@/features/categories/components/categories-section";
import { AboutSummary } from "@/features/marketing/components/about-summary";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { Hero } from "@/features/marketing/components/hero";
import { Section } from "@/features/marketing/components/section";
import { WhyUsGrid } from "@/features/marketing/components/why-us-grid";
import { WHY_US } from "@/features/marketing/content";
import { MediaCarouselSection } from "@/features/media/components/media-carousel-section";
import { FeaturedProductsSection } from "@/features/products/components/featured-products";
import { createPageMetadata } from "@/lib/metadata";
import { buildOrganization, buildWebSite } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  path: ROUTES.home,
});

export default function HomePage() {
  const jsonLdData = [buildOrganization(), buildWebSite()];

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* 1. Hero with animated capsule artwork and dual CTAs */}
      <Hero />

      {/* Restrained structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 2. Short About Teaser */}
      <AboutSummary />

      {/* Structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 3. Product Categories Showcase */}
      <CategoriesSection />

      {/* Structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 4. Featured Products Automatic Carousel */}
      <FeaturedProductsSection />

      {/* Structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 5. Media Gallery Carousel */}
      <MediaCarouselSection />

      {/* Structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 6. "Why Us" asymmetric ledger composition */}
      <Section heading={WHY_US.heading}>
        <WhyUsGrid points={WHY_US.points} />
      </Section>

      {/* 6. Dark Enquiry Call-to-Action Band */}
      <CtaBanner />

      {/* 7. Latest Blog Preview */}
      <LatestBlogsSection />
    </>
  );
}
