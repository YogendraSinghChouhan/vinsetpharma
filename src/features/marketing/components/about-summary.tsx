import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { ABOUT } from "../content";

export function AboutSummary() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-8">
          <SectionHeading
            title={ABOUT.introduction.heading}
            description={ABOUT.introduction.text}
          />

          {/* Tactile Blister Pack Card for Values & Link */}
          <BlisterPocket depth="subtle" className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8 pb-8 border-b border-border/80">
              {ABOUT.values.items.map((val) => (
                <div key={val.title} className="flex flex-col gap-2">
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                    {val.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {val.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground max-w-xl">
                Explore our documented operating standards, quality verification
                protocols, and company history.
              </p>
              <Link
                href={ROUTES.aboutUs}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0"
              >
                {ABOUT.introduction.linkLabel}
              </Link>
            </div>
          </BlisterPocket>
        </div>
      </Container>
    </section>
  );
}
