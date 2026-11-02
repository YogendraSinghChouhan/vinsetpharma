import { Container } from "@/components/layout/container";
import { ABOUT } from "../content";
import { ABOUT_IMAGES } from "../images";
import { MarketingImageSlot } from "./marketing-image-slot";

export function AboutWorkflow() {
  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-surface-tint/30">
      <Container>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Procurement Steps
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {ABOUT.workflow.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {ABOUT.workflow.subheading}
            </p>
          </div>

          {/* 4-Step Sequence - Vertical on mobile, horizontal on desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {ABOUT.workflow.steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs relative"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-2xs">
                    {step.number}
                  </div>
                  <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Supporting Image - Flat-lay Capsules */}
          <div className="mt-2">
            <MarketingImageSlot
              slot={ABOUT_IMAGES.process}
              aspectClassName="aspect-21/9 sm:aspect-3/1 min-h-[180px]"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
