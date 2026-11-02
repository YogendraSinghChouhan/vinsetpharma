import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CTA } from "../content";

export function CtaBanner() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-12 sm:px-12 sm:py-16 lg:px-16 text-center text-brand-dark-foreground border border-[oklch(1_0_0/10%)] shadow-sm">
          {/* Subtle debossed background blister packaging contour */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full border border-[oklch(1_0_0/6%)] bg-[oklch(1_0_0/2%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full border border-[oklch(1_0_0/6%)] bg-[oklch(1_0_0/2%)]"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-brand-dark-foreground">
              {CTA.heading}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-brand-dark-muted">
              {CTA.text}
            </p>

            <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Link
                href={CTA.primaryCta.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent-light px-7 py-3 text-sm font-semibold text-brand-dark shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                {CTA.primaryCta.label}
              </Link>
              <Link
                href={CTA.secondaryCta.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[oklch(1_0_0/25%)] bg-[oklch(1_0_0/5%)] px-7 py-3 text-sm font-semibold text-brand-dark-foreground shadow-2xs transition-colors hover:bg-[oklch(1_0_0/12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                {CTA.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
