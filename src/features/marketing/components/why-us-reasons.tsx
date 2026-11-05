import { BlisterPocket } from "@/components/brand/blister-pocket";
import { Container } from "@/components/layout/container";
import { WHY_US, WHY_US_ICONS, type WhyUsPoint } from "../content";

type WhyUsReasonsProps = {
  points?: readonly WhyUsPoint[];
};

export function WhyUsReasons({ points = WHY_US.points }: WhyUsReasonsProps) {
  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-card">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Sticky Editorial Heading Column on Desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Core Distinctions
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {WHY_US.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[45ch]">
              {WHY_US.reasonsIntro}
            </p>
          </div>

          {/* Expanded List Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {points.map((point, index) => {
              const Icon = WHY_US_ICONS[point.icon];
              return (
                <BlisterPocket
                  key={point.title}
                  depth="subtle"
                  className="flex flex-col gap-4 p-6 sm:p-7 border-border/80 bg-surface-tint/40 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-card text-primary shadow-2xs ring-1 ring-border/80">
                      <Icon className="size-5 shrink-0" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Pillar 0{index + 1}
                      </span>
                      <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                        {point.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-[65ch]">
                    {point.detailedDescription}
                  </p>
                </BlisterPocket>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
