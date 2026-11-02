import { Container } from "@/components/layout/container";
import { PageHeader } from "@/features/marketing/components/page-header";
import { ABOUT } from "../content";
import { ABOUT_IMAGES } from "../images";
import { MarketingImageSlot } from "./marketing-image-slot";

export function AboutHero() {
  return (
    <>
      <PageHeader
        title={ABOUT.header.title}
        description={ABOUT.header.tagline}
        crumbs={[{ label: "Home", href: "/" }, { label: ABOUT.header.title }]}
      />
      <section className="pb-10 pt-2 sm:pb-14">
        <Container>
          <div className="flex flex-col gap-6">
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {ABOUT.header.intro}
            </p>
            <MarketingImageSlot
              slot={ABOUT_IMAGES.hero}
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
