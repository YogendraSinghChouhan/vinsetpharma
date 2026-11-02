import Link from "next/link";
import { HeroArtwork } from "@/components/brand/hero-artwork";
import { Container } from "@/components/layout/container";
import { HERO } from "../content";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Hero Message & Pill Actions */}
          <div className="flex flex-col items-start gap-5 sm:gap-6 lg:col-span-7 min-w-0">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12] break-words">
              {HERO.headline}
            </h1>
            <p className="max-w-[56ch] text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              {HERO.supportingLine}
            </p>
            <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {HERO.primaryCta.label}
              </Link>
              <Link
                href={HERO.secondaryCta.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Right Column: Orchestrated Capsule Blister Artwork */}
          <div className="flex items-center justify-center lg:col-span-5 min-w-0 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-lg">
            <HeroArtwork className="w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
