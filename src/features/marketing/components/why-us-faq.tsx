import { IconChevronDown } from "@tabler/icons-react";
import { Container } from "@/components/layout/container";
import { WHY_US } from "../content";

export function WhyUsFaq() {
  const { faq } = WHY_US;

  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-surface-tint/30">
      <Container>
        <div className="flex flex-col gap-10 max-w-4xl mx-auto">
          <div className="flex flex-col gap-2 text-center items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Enquiry Clarity
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {faq.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[55ch]">
              {faq.subheading}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs transition-colors open:bg-card/95 open:border-primary/40 open:shadow-xs"
              >
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
                  <span className="text-left">{item.question}</span>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-tint text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary">
                    <IconChevronDown className="size-4" aria-hidden="true" />
                  </div>
                </summary>
                <div className="pt-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground border-t border-border/60 mt-3 max-w-[65ch]">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
