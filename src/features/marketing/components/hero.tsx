import { IconChecklist, IconMessages, IconPill } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { BlisterPocket } from "@/components/brand/blister-pocket";
import { Container } from "@/components/layout/container";
import { HERO } from "../content";
import { HOME_IMAGES } from "../images";

export function Hero() {
  const heroImage = HOME_IMAGES.hero;

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Hero Message & Pill Actions */}
          <div className="flex flex-col items-start gap-5 sm:gap-6 lg:col-span-7 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-tint px-3.5 py-1 text-xs font-semibold text-primary shadow-2xs">
              <span className="size-2 rounded-full bg-accent" />
              <span>Pharmaceutical Supply & Procurement</span>
            </div>

            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12] break-words">
              {HERO.headline}
            </h1>

            <p className="max-w-[54ch] text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              {HERO.supportingLine}
            </p>

            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row">
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

            {/* Reassurance Features Strip */}
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-border/70 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconPill
                  className="size-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                <span>Solid & Liquid Oral Dosages</span>
              </div>
              <div className="flex items-center gap-2">
                <IconChecklist
                  className="size-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                <span>Direct Product Quotations</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMessages
                  className="size-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                <span>Attentive Communication</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Photographic Blister Frame */}
          <div className="flex items-center justify-center lg:col-span-5 min-w-0 w-full max-w-lg mx-auto">
            {heroImage ? (
              <BlisterPocket
                depth="deep"
                className="relative w-full overflow-hidden border-border/80 bg-surface-tint p-2.5 sm:p-3 shadow-sm rounded-3xl"
              >
                <div className="relative aspect-4/3 sm:aspect-5/4 lg:aspect-4/3 w-full overflow-hidden rounded-2xl bg-card ring-1 ring-border/70">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    width={heroImage.width}
                    height={heroImage.height}
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 520px"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-card/90 px-3.5 py-2 backdrop-blur-md ring-1 ring-border/80 shadow-2xs text-xs">
                    <span className="font-semibold text-foreground">
                      Verified Formulation Range
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Online Catalogue
                    </span>
                  </div>
                </div>
              </BlisterPocket>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
