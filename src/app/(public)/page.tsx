import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { ROUTES, SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { LatestBlogsSection } from "@/features/blogs/components/latest-blogs";
import { CategoriesSection } from "@/features/categories/components/categories-section";
import { AboutSummary } from "@/features/marketing/components/about-summary";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { Hero } from "@/features/marketing/components/hero";
import { HomeBannerCarousel } from "@/features/marketing/components/home-banner-carousel";
import { Section } from "@/features/marketing/components/section";
import { WhyUsGrid } from "@/features/marketing/components/why-us-grid";
import { HOME_COPY, WHY_US } from "@/features/marketing/content";
import { HOME_IMAGES } from "@/features/marketing/images";
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

      {/* 2. Product marketing banner carousel */}
      <section
        aria-labelledby="product-marketing-banners-heading"
        className="py-12 sm:py-16 lg:py-20"
      >
        <Container>
          <div className="mb-8 flex flex-col gap-2 sm:mb-10">
            <h2
              id="product-marketing-banners-heading"
              className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {HOME_COPY.bannerTitle}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {HOME_COPY.bannerIntro}
            </p>
          </div>
          <HomeBannerCarousel images={HOME_IMAGES.banners} />
        </Container>
      </section>

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
