import { Container } from "@/components/layout/container";
import { PageHeader } from "@/features/marketing/components/page-header";
import { PAGE_META, WHY_US } from "../content";
import { WHY_US_IMAGES } from "../images";
import { MarketingImageSlot } from "./marketing-image-slot";

export function WhyUsHero() {
  return (
    <>
      <PageHeader
        title={PAGE_META.whyUs.title}
        description={WHY_US.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: PAGE_META.whyUs.title },
        ]}
      />
      <section className="pb-10 pt-2 sm:pb-14">
        <Container>
          <div className="flex flex-col gap-6">
            <MarketingImageSlot
              slot={WHY_US_IMAGES.hero}
              priority
              aspectClassName="aspect-21/9 sm:aspect-2/1 min-h-[220px]"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
