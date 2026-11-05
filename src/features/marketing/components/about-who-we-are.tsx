import { Container } from "@/components/layout/container";
import { ABOUT } from "../content";

export function AboutWhoWeAre() {
  const [leadParagraph, ...supportingParagraphs] = ABOUT.whoWeAre.paragraphs;

  return (
    <section className="border-t border-border/60 bg-card py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-7 text-brand-dark-foreground sm:p-10 lg:min-h-[30rem] lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 size-56 rounded-full border border-brand-dark-foreground/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 -left-20 size-64 rounded-full border border-brand-dark-foreground/10"
            />

            <div className="relative flex h-full flex-col justify-between gap-16">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
                <span className="h-px w-8 bg-accent-light" />
                <span>01 / Identity</span>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="max-w-sm font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                  {ABOUT.whoWeAre.heading}
                </h2>
                <p className="max-w-sm text-base leading-relaxed text-brand-dark-muted">
                  {ABOUT.whoWeAre.subheading}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-dark-foreground/15 pt-5 text-xs font-medium uppercase tracking-wide text-brand-dark-muted">
                <div>
                  <p className="mb-1 text-brand-dark-foreground">Role</p>
                  <p>Pharmaceutical marketing</p>
                </div>
                <div>
                  <p className="mb-1 text-brand-dark-foreground">Audience</p>
                  <p>Healthcare professionals and trade partners</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:py-3">
            <div className="max-w-2xl border-l-2 border-primary/30 pl-5 sm:pl-7">
              <p className="text-justify text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                {leadParagraph}
              </p>
            </div>

            <div className="grid gap-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7 sm:text-base">
              {supportingParagraphs.map((paragraph) => (
                <p className="text-justify" key={paragraph.slice(0, 30)}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
