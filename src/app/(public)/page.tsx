import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { ROUTES, SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { LatestBlogsSection } from "@/features/blogs/components/latest-blogs";
import { AboutSummary } from "@/features/marketing/components/about-summary";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { Hero } from "@/features/marketing/components/hero";
import { Section } from "@/features/marketing/components/section";
import { WhyUsGrid } from "@/features/marketing/components/why-us-grid";
import { WHY_US } from "@/features/marketing/content";
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

      {/* 3. Featured Products Grid (blister pocket well treatment) */}
      <FeaturedProductsSection />

      {/* Structural perforation divider */}
      <Container>
        <PerforationDivider />
      </Container>

      {/* 4. "Why Us" asymmetric ledger composition */}
      <Section heading={WHY_US.heading}>
        <WhyUsGrid points={WHY_US.points} />
      </Section>

      {/* 5. Dark Enquiry Call-to-Action Band */}
      <CtaBanner />

      {/* 6. Latest Blog Preview */}
      <LatestBlogsSection />
    </>
  );
}
