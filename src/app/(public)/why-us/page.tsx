import { ROUTES } from "@/config/site";
import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { PageHeader } from "@/features/marketing/components/page-header";
import { Section } from "@/features/marketing/components/section";
import { WhyUsGrid } from "@/features/marketing/components/why-us-grid";
import { PAGE_META, WHY_US } from "@/features/marketing/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: PAGE_META.whyUs.title,
  description: PAGE_META.whyUs.description,
  path: ROUTES.whyUs,
});

export default function WhyUsPage() {
  return (
    <>
      <PageHeader
        title={PAGE_META.whyUs.title}
        description={PAGE_META.whyUs.description}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: PAGE_META.whyUs.title },
        ]}
      />
      <Section heading={WHY_US.heading}>
        <WhyUsGrid points={WHY_US.points} detailed />
      </Section>
      <CtaBanner />
    </>
  );
}
