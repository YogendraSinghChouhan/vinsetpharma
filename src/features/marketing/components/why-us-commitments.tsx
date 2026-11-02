import { Container } from "@/components/layout/container";
import { WHY_US } from "../content";
import { WHY_US_IMAGES } from "../images";
import { MarketingImageSlot } from "./marketing-image-slot";

export function WhyUsCommitments() {
  const { commitments } = WHY_US;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Supporting Image (Pharmacy Shelving) */}
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
            <MarketingImageSlot
              slot={WHY_US_IMAGES.principles}
              aspectClassName="aspect-4/3 sm:aspect-1/1"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>

          {/* Right Column: Quiet strip of principle statements (no numbers) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Ethical Baseline
              </span>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {commitments.heading}
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {commitments.subheading}
              </p>
            </div>

            <div className="divide-y divide-border/80 border-y border-border/80">
              {commitments.items.map((statement) => (
                <div
                  key={statement.slice(0, 30)}
                  className="py-4.5 sm:py-5 flex items-start gap-3"
                >
                  <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm sm:text-base leading-relaxed text-foreground max-w-[65ch]">
                    {statement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
