import { ROUTES } from "@/config/site";
import { AboutContactPoints } from "@/features/marketing/components/about-contact-points";
import { AboutHero } from "@/features/marketing/components/about-hero";
import { AboutMissionVision } from "@/features/marketing/components/about-mission-vision";
import { AboutValues } from "@/features/marketing/components/about-values";
import { AboutWhatWeDo } from "@/features/marketing/components/about-what-we-do";
import { AboutWhoWeAre } from "@/features/marketing/components/about-who-we-are";
import { AboutWorkflow } from "@/features/marketing/components/about-workflow";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { PAGE_META } from "@/features/marketing/content";
import { MediaCarouselSection } from "@/features/media/components/media-carousel-section";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: PAGE_META.about.title,
  description: PAGE_META.about.description,
  path: ROUTES.aboutUs,
});

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero with intro paragraph & wide hero image in pocket-style frame */}
      <AboutHero />

      {/* 2. Who we are narrative */}
      <AboutWhoWeAre />

      {/* 3. Mission and Vision contrasting panels */}
      <AboutMissionVision />

      {/* 4. What we do platform function cards */}
      <AboutWhatWeDo />

      {/* 5. Our values ruled list with supporting glassware image */}
      <AboutValues />

      {/* 6. How working with us looks 4-step sequence with supporting capsules image */}
      <AboutWorkflow />

      {/* 7. Where to find us regional contact points */}
      <AboutContactPoints />

      {/* 8. Media gallery showcase */}
      <MediaCarouselSection />

      {/* 9. Dark enquiry call-to-action band */}
      <CtaBanner />
    </>
  );
}
