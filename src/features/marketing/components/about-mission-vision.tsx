import { IconCompass, IconTarget } from "@tabler/icons-react";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { Container } from "@/components/layout/container";
import { ABOUT } from "../content";

export function AboutMissionVision() {
  const { mission, vision } = ABOUT.missionVision;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Guiding Direction
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {ABOUT.missionVision.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
            {/* Mission Panel - Soft Surface Tint Tactile Well */}
            <BlisterPocket
              depth="deep"
              className="flex flex-col justify-between p-6 sm:p-8 border-border/90 bg-surface-tint"
            >
              <div className="flex flex-col gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-card text-primary shadow-2xs ring-1 ring-border/80">
                  <IconTarget className="size-6 shrink-0" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  {mission.title}
                </h3>
                <p className="text-base sm:text-lg font-medium leading-snug text-foreground max-w-[55ch]">
                  {mission.statement}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[55ch]">
                  {mission.supporting}
                </p>
              </div>
            </BlisterPocket>

            {/* Vision Panel - Clean Card Surface with Precision Contrast Accent */}
            <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xs">
              <div className="flex flex-col gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-surface-tint text-accent shadow-2xs ring-1 ring-border/80">
                  <IconCompass className="size-6 shrink-0" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  {vision.title}
                </h3>
                <p className="text-base sm:text-lg font-medium leading-snug text-foreground max-w-[55ch]">
                  {vision.statement}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-[55ch]">
                  {vision.supporting}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
