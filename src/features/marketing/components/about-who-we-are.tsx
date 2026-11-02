import { Container } from "@/components/layout/container";
import { ABOUT } from "../content";

export function AboutWhoWeAre() {
  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-card">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Core Identity
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {ABOUT.whoWeAre.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {ABOUT.whoWeAre.subheading}
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-[65ch]">
            {ABOUT.whoWeAre.paragraphs.map((para) => (
              <p key={para.slice(0, 30)}>{para}</p>
            ))}

            {ABOUT.whoWeAre.history ? (
              <div className="rounded-xl border border-border/80 bg-surface-tint p-5 text-foreground">
                <p className="font-semibold text-xs uppercase tracking-wider text-primary mb-1">
                  Company Background
                </p>
                <p className="text-sm leading-relaxed">
                  {ABOUT.whoWeAre.history}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
