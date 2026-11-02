import { Container } from "@/components/layout/container";
import { WHY_US } from "../content";

export function WhyUsExpectations() {
  const { expectations } = WHY_US;

  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-surface-tint/30">
      <Container>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Service Standards
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {expectations.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {expectations.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {expectations.items.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-colors hover:border-primary/40"
              >
                <div className="flex flex-col gap-3">
                  <div className="h-1 w-8 rounded-full bg-accent" />
                  <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
