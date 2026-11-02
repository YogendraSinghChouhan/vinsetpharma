import { ROUTES } from "@/config/site";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { WhyUsCommitments } from "@/features/marketing/components/why-us-commitments";
import { WhyUsExpectations } from "@/features/marketing/components/why-us-expectations";
import { WhyUsFaq } from "@/features/marketing/components/why-us-faq";
import { WhyUsHero } from "@/features/marketing/components/why-us-hero";
import { WhyUsReasons } from "@/features/marketing/components/why-us-reasons";
import { PAGE_META } from "@/features/marketing/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: PAGE_META.whyUs.title,
  description: PAGE_META.whyUs.description,
  path: ROUTES.whyUs,
});

export default function WhyUsPage() {
  return (
    <>
      {/* 1. Hero with wide hero image and short intro */}
      <WhyUsHero />

      {/* 2. Six reasons expanded in an editorial sticky column layout */}
      <WhyUsReasons />

      {/* 3. What to expect when you work with us */}
      <WhyUsExpectations />

      {/* 4. Our commitments quiet strip with supporting pharmacy image */}
      <WhyUsCommitments />

      {/* 5. Frequently asked questions with accessible native details/summary */}
      <WhyUsFaq />

      {/* 6. Dark enquiry call-to-action band */}
      <CtaBanner />
    </>
  );
}
