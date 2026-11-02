import { Container } from "@/components/layout/container";
import { ABOUT } from "../content";
import { ABOUT_IMAGES } from "../images";
import { MarketingImageSlot } from "./marketing-image-slot";

export function AboutValues() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Ruled list of 5 values */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Foundational Tenets
              </span>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {ABOUT.values.heading}
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {ABOUT.values.subheading}
              </p>
            </div>

            <div className="divide-y divide-border/80 border-y border-border/80">
              {ABOUT.values.items.map((value) => (
                <div
                  key={value.title}
                  className="py-4.5 sm:py-5 flex flex-col gap-1.5"
                >
                  <h3 className="font-heading text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground max-w-[65ch]">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Supporting Image (Glassware) */}
          <div className="lg:col-span-5 flex flex-col">
            <MarketingImageSlot
              slot={ABOUT_IMAGES.values}
              aspectClassName="aspect-4/3 sm:aspect-1/1"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
