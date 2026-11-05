import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeroSlideshow } from "@/features/hero/components/hero-slideshow";
import { getHeroSlides } from "@/features/hero/public-data";
import { HERO } from "../content";
import { HOME_IMAGES } from "../images";

export async function Hero() {
  const slides = await getHeroSlides().catch(() => []);
  const heroImage = HOME_IMAGES.hero;

  return (
    <section
      id="home-hero-theme"
      aria-label="Homepage hero banner"
      className="relative overflow-hidden bg-brand-dark text-white py-16 sm:py-20 lg:py-24 xl:py-28 border-b border-white/10"
    >
      {/* Oversized partially cropped background decorative typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-3 sm:-bottom-6 lg:-bottom-8 z-0 select-none overflow-hidden text-center"
      >
        <span className="font-heading block text-[clamp(3.5rem,13vw,13rem)] font-extrabold uppercase tracking-tight text-white/[0.05] sm:text-white/[0.06] leading-none whitespace-nowrap">
          PHARMACEUTICALS
        </span>
      </div>

      <Container className="relative z-10 w-full">
        {/* Desktop 2-column / Mobile vertical stack */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column (Desktop) / Upper Portion (Mobile) */}
          <div className="flex flex-col items-start gap-5 sm:gap-6 lg:col-span-7 min-w-0">
            {/* Exactly one h1 on page */}
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] xl:leading-[1.08] break-words">
              {HERO.headline}
            </h1>

            {/* Short supporting description */}
            <p className="max-w-[48ch] text-base leading-relaxed text-white/80 sm:text-lg sm:leading-relaxed">
              {HERO.supportingLine}
            </p>

            {/* Two horizontally aligned CTA buttons */}
            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-accent-light px-8 py-3 text-sm sm:text-base font-semibold text-brand-dark shadow-md transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                {HERO.primaryCta.label}
              </Link>
              <Link
                href={HERO.secondaryCta.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 bg-transparent px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-xs transition-colors hover:bg-white/10 hover:border-white/70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Right Column (Desktop) / Lower Section (Mobile) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end mt-2 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Clipped Visual Area with dynamic image / slideshow */}
              <div className="relative w-full aspect-[5/4] sm:aspect-[16/11] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-brand-dark/80">
                {slides && slides.length > 0 ? (
                  <HeroSlideshow slides={slides} />
                ) : heroImage ? (
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 560px"
                    className="h-full w-full object-cover object-right sm:object-center transition-transform duration-700 hover:scale-[1.02]"
                  />
                ) : null}

                {/* Subtle ambient lighting vignette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
