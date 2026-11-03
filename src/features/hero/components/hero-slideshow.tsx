"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PublicHeroSlide } from "../public-data";
import {
  computeNextSlideIndex,
  getSlideTransformOrigin,
  SLIDE_CROSSFADE_DURATION_MS,
  SLIDE_DISPLAY_DURATION_MS,
} from "../slideshow-logic";
import { getFocusPosition } from "../utils";

interface HeroSlideshowProps {
  slides: PublicHeroSlide[];
}

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const slideCount = slides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [mountedDeferred, setMountedDeferred] = useState(false);
  const [loadedIndices, setLoadedIndices] = useState<number[]>([0]);
  const [failedIndices, setFailedIndices] = useState<number[]>([]);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crossfadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPaused = isDocumentHidden || isOffScreen;

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // 2. Defer mounting slides 1..N until after window load + idle
  useEffect(() => {
    if (slideCount <= 1 || typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleHandle: number | null = null;

    const scheduleDeferredMount = () => {
      if ("requestIdleCallback" in window) {
        idleHandle = (
          window as unknown as {
            requestIdleCallback: (cb: () => void) => number;
          }
        ).requestIdleCallback(() => {
          setMountedDeferred(true);
        });
      } else {
        timeoutId = setTimeout(() => {
          setMountedDeferred(true);
        }, 150);
      }
    };

    if (document.readyState === "complete") {
      scheduleDeferredMount();
    } else {
      window.addEventListener("load", scheduleDeferredMount, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleDeferredMount);
      if (timeoutId) clearTimeout(timeoutId);
      if (idleHandle !== null && "cancelIdleCallback" in window) {
        (
          window as unknown as { cancelIdleCallback: (h: number) => void }
        ).cancelIdleCallback(idleHandle);
      }
    };
  }, [slideCount]);

  // 3. Document visibility (pause when tab hidden)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
      setIsDocumentHidden(document.visibilityState === "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 4. IntersectionObserver (pause when off-screen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOffScreen(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mark a slide as loaded & decoded
  const markLoaded = useCallback((index: number) => {
    setLoadedIndices((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    );
  }, []);

  // Mark a slide as failed
  const markFailed = useCallback((index: number) => {
    setFailedIndices((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    );
  }, []);

  // Transition to a specific slide
  const advanceToSlide = useCallback(
    (nextIdx: number) => {
      setPreviousIndex(currentIndex);
      setCurrentIndex(nextIdx);

      if (crossfadeTimerRef.current) {
        clearTimeout(crossfadeTimerRef.current);
      }

      crossfadeTimerRef.current = setTimeout(() => {
        setPreviousIndex(null);
      }, SLIDE_CROSSFADE_DURATION_MS);
    },
    [currentIndex],
  );

  // 5. Autoplay rotation orchestrator
  useEffect(() => {
    if (rotationTimerRef.current) {
      clearTimeout(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }

    if (slideCount <= 1 || isPaused || prefersReducedMotion) {
      return;
    }

    const nextIndex = computeNextSlideIndex({
      currentIndex,
      slideCount,
      loadedIndices,
      failedIndices,
      isPaused,
      isHidden: isDocumentHidden || isOffScreen,
      prefersReducedMotion,
    });

    if (nextIndex === null) {
      return;
    }

    rotationTimerRef.current = setTimeout(() => {
      advanceToSlide(nextIndex);
    }, SLIDE_DISPLAY_DURATION_MS);

    return () => {
      if (rotationTimerRef.current) {
        clearTimeout(rotationTimerRef.current);
      }
    };
  }, [
    currentIndex,
    slideCount,
    loadedIndices,
    failedIndices,
    isPaused,
    isDocumentHidden,
    isOffScreen,
    prefersReducedMotion,
    advanceToSlide,
  ]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      if (crossfadeTimerRef.current) clearTimeout(crossfadeTimerRef.current);
    };
  }, []);

  if (slideCount === 0) {
    return null;
  }

  const firstSlide = slides[0];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-brand-dark"
      aria-hidden="true"
    >
      {/* 1. First Slide (Always rendered in initial server HTML as LCP image) */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity ease-in-out",
          currentIndex === 0
            ? "z-20 opacity-100"
            : previousIndex === 0
              ? "z-10 opacity-100"
              : "z-0 opacity-0 pointer-events-none",
          prefersReducedMotion ? "duration-0" : "duration-[1100ms]",
        )}
        style={{
          willChange:
            currentIndex === 0 || previousIndex === 0
              ? "opacity, transform"
              : "auto",
        }}
      >
        <div
          className={cn(
            "relative h-full w-full",
            !prefersReducedMotion && slideCount > 1 && currentIndex === 0
              ? "scale-[1.06] transition-transform duration-[6500ms] ease-out"
              : "scale-100",
          )}
          style={{
            transformOrigin: getSlideTransformOrigin(firstSlide.focus),
          }}
        >
          <Image
            src={firstSlide.imageUrl}
            alt={firstSlide.alt || ""}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: getFocusPosition(firstSlide.focus),
            }}
          />
        </div>
      </div>

      {/* 2. Deferred Slides 2..N (Mounted only after load + idle to preserve LCP) */}
      {mountedDeferred &&
        slides.slice(1).map((slide, offset) => {
          const index = offset + 1;
          const isCurrent = currentIndex === index;
          const isPrevious = previousIndex === index;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity ease-in-out",
                isCurrent
                  ? "z-20 opacity-100"
                  : isPrevious
                    ? "z-10 opacity-100"
                    : "z-0 opacity-0 pointer-events-none",
                prefersReducedMotion ? "duration-0" : "duration-[1100ms]",
              )}
              style={{
                willChange:
                  isCurrent || isPrevious ? "opacity, transform" : "auto",
              }}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  !prefersReducedMotion && isCurrent
                    ? "scale-[1.06] transition-transform duration-[6500ms] ease-out"
                    : "scale-100",
                )}
                style={{
                  transformOrigin: getSlideTransformOrigin(slide.focus),
                }}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt || ""}
                  fill
                  sizes="100vw"
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                    objectPosition: getFocusPosition(slide.focus),
                  }}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if ("decode" in img) {
                      img
                        .decode()
                        .then(() => markLoaded(index))
                        .catch(() => markLoaded(index));
                    } else {
                      markLoaded(index);
                    }
                  }}
                  onError={() => {
                    markFailed(index);
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
