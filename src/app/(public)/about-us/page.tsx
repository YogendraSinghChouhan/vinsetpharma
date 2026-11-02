import { IconPill } from "@tabler/icons-react";
import { ROUTES } from "@/config/site";
import { PageHeader } from "@/features/marketing/components/page-header";
import { Section } from "@/features/marketing/components/section";
import { ABOUT } from "@/features/marketing/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: ABOUT.introduction.heading,
  description:
    "Learn about Vinsent Pharma, its preparation and quality approach, mission and values.",
  path: ROUTES.aboutUs,
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={ABOUT.introduction.heading}
        description="Vinsent Pharma is a pharmaceutical company focused on careful preparation and quality of its products."
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: ABOUT.introduction.heading },
        ]}
      />
      <Section heading={ABOUT.introduction.heading}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-lg text-muted-foreground">
              {ABOUT.introduction.text}
            </p>
            <p>{ABOUT.introduction.history}</p>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-secondary to-primary/5 ring-1 ring-border">
            <IconPill className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-primary/30" />
            <span className="absolute bottom-4 left-4 text-sm text-muted-foreground">
              Image placeholder
            </span>
          </div>
        </div>
      </Section>
      <Section heading={ABOUT.mission.heading}>
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground">
            {ABOUT.mission.statement}
          </p>
        </div>
      </Section>
      <Section heading={ABOUT.values.heading}>
        <dl className="grid gap-6 sm:grid-cols-3">
          {ABOUT.values.items.map((value) => (
            <div
              key={value.title}
              className="flex flex-col gap-2 rounded-xl border bg-card p-6 shadow-sm"
            >
              <dt className="text-lg font-semibold text-foreground">
                {value.title}
              </dt>
              <dd className="text-sm text-muted-foreground">{value.text}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section heading={ABOUT.whatWeDo.heading}>
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground">{ABOUT.whatWeDo.text}</p>
        </div>
      </Section>
    </>
  );
}
