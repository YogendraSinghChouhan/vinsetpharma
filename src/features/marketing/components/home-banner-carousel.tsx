"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageSlot } from "../images";

const SLIDE_DURATION_MS = 5000;
interface HomeBannerCarouselProps {
  images: readonly ImageSlot[];
}

export function HomeBannerCarousel({ images }: HomeBannerCarouselProps) {
  const slides = images.filter((image): image is NonNullable<ImageSlot> =>
    Boolean(image),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () =>
      mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative mx-auto w-[98%] overflow-hidden rounded-3xl border border-border/70 bg-white shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      aria-roledescription="carousel"
      aria-label="Vinset pharmaceuticals product marketing banners"
    >
      <div className="relative aspect-[16/10] min-h-64 w-full bg-white sm:min-h-80 lg:min-h-[32rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, 92vw"
              className="object-contain"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goToSlide(currentIndex - 1)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <IconChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(currentIndex + 1)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <IconChevronRight className="size-5" aria-hidden="true" />
            </button>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Show banner ${index + 1} of ${slides.length}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                  className="group inline-flex min-h-6 min-w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/60 group-hover:bg-white"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
