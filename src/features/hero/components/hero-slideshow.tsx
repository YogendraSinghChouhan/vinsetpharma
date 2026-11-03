"use client";

import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PublicHeroSlide } from "../public-data";
import {
  computeNextSlideIndex,
  getSlideTransformOrigin,
  RESUME_AFTER_INTERACTION_MS,
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
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isOffScreen, setIsOffScreen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualAnnouncement, setManualAnnouncement] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const rotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crossfadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPaused = isUserPaused || isDocumentHidden || isOffScreen;

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
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Manual dot selection
  const handleSelectDot = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;

    advanceToSlide(targetIdx);
    setManualAnnouncement(`Showing image ${targetIdx + 1} of ${slideCount}`);

    // Pause temporarily, resume 3 seconds after interaction unless user pressed Pause
    if (!isUserPaused) {
      if (rotationTimerRef.current) clearTimeout(rotationTimerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

      resumeTimerRef.current = setTimeout(() => {
        // Triggers effect re-evaluation
        setCurrentIndex((curr) => curr);
      }, RESUME_AFTER_INTERACTION_MS);
    }
  };

  const handleTogglePause = () => {
    const nextState = !isUserPaused;
    setIsUserPaused(nextState);
    setManualAnnouncement(nextState ? "Slideshow paused" : "Slideshow playing");

    if (!nextState) {
      // Resumed manually: restart timer after short delay
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setCurrentIndex((curr) => curr);
      }, 1000);
    }
  };

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
          prefersReducedMotion ? "duration-0" : "duration-[1800ms]",
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
              ? "scale-[1.06] transition-transform duration-[8800ms] ease-out"
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
                prefersReducedMotion ? "duration-0" : "duration-[1800ms]",
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
                    ? "scale-[1.06] transition-transform duration-[8800ms] ease-out"
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

      {/* 3. Controls Layer (Only rendered when there are 2 or more slides) */}
      {slideCount >= 2 && (
        <div className="pointer-events-auto absolute z-30 flex items-center gap-2 bottom-4 sm:bottom-6 right-4 sm:right-8">
          {/* Pause / Play Button */}
          <button
            type="button"
            aria-pressed={isUserPaused}
            aria-label={isUserPaused ? "Play slideshow" : "Pause slideshow"}
            onClick={handleTogglePause}
            className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/30 bg-brand-dark/60 text-white shadow-xs backdrop-blur-md transition-colors hover:bg-brand-dark/85 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
          >
            {isUserPaused ? (
              <IconPlayerPlay className="size-4 ml-0.5" aria-hidden="true" />
            ) : (
              <IconPlayerPause className="size-4" aria-hidden="true" />
            )}
          </button>

          {/* Dot Indicators */}
          <div
            role="tablist"
            aria-label="Slideshow image selector"
            className="flex items-center gap-1 rounded-full border border-white/20 bg-brand-dark/60 px-2 py-1 backdrop-blur-md shadow-xs"
          >
            {slides.map((slide, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`Show image ${idx + 1} of ${slideCount}`}
                  onClick={() => handleSelectDot(idx)}
                  className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      isSelected
                        ? "h-2 w-6 bg-accent-light"
                        : "size-2 bg-white/50 hover:bg-white/80",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Polite screen-reader announcer for manual interaction only */}
      <div className="sr-only" aria-live="polite">
        {manualAnnouncement}
      </div>
    </div>
  );
}
