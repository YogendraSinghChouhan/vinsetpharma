import { Container } from "@/components/layout/container";
import { ABOUT, ABOUT_ICONS } from "../content";

export function AboutWhatWeDo() {
  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-surface-tint/40">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Platform Function
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {ABOUT.whatWeDo.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {ABOUT.whatWeDo.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {ABOUT.whatWeDo.items.map((item) => {
              const Icon = ABOUT_ICONS[item.icon as keyof typeof ABOUT_ICONS];
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-surface-tint text-primary shadow-2xs ring-1 ring-border/80">
                      <Icon className="size-5 shrink-0" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
