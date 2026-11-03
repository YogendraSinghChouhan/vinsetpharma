"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_AUTOPLAY_INTERVAL,
  getNextSlideIndex,
  getPrevSlideIndex,
  INTERACTION_RESUME_DELAY,
  shouldAutoplay,
} from "./carousel-logic";

export interface AutoCarouselProps {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  slideClassName?: string;
  gapClassName?: string;
  autoplayInterval?: number;
}

export function AutoCarousel({
  children,
  ariaLabel,
  className,
  slideClassName,
  gapClassName = "gap-4 sm:gap-6",
  autoplayInterval = DEFAULT_AUTOPLAY_INTERVAL,
}: AutoCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const interactionTimerRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const isProgrammaticScrollRef = React.useRef(false);

  // Filter valid children to count slides accurately
  const slides = React.useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children],
  );
  const totalSlides = slides.length;

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [canScroll, setCanScroll] = React.useState(false);
  const [isPausedByUser, setIsPausedByUser] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(false);
  const [isIntersecting, setIsIntersecting] = React.useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  // Check prefers-reduced-motion once mounted
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPausedByUser(true);
    }

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsPausedByUser(true);
      }
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  // Monitor visibility of the document
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Monitor intersection with viewport
  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // ResizeObserver to detect overflow and determine whether controls/autoplay are active
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const checkOverflow = () => {
      const overflows = container.scrollWidth > container.clientWidth + 2;
      setCanScroll(overflows);
    };

    checkOverflow();

    const observer = new ResizeObserver(() => {
      checkOverflow();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Track scroll position to update current index
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const scrollLeft = container.scrollLeft;
      const childrenElements = Array.from(container.children) as HTMLElement[];
      if (childrenElements.length === 0) return;

      let closestIndex = 0;
      let minDiff = Infinity;
      for (let i = 0; i < childrenElements.length; i++) {
        const child = childrenElements[i];
        const diff = Math.abs(
          child.offsetLeft - container.offsetLeft - scrollLeft,
        );
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
      setCurrentIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to a specific slide index using scrollTo (never scrollIntoView)
  const scrollToSlide = React.useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const childrenElements = Array.from(container.children) as HTMLElement[];
      const targetElement = childrenElements[index];
      if (!targetElement) return;

      isProgrammaticScrollRef.current = true;
      const targetLeft = targetElement.offsetLeft - container.offsetLeft;

      container.scrollTo({
        left: targetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      setCurrentIndex(index);

      // Reset programmatic flag after smooth scroll completes
      const timeout = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);

      return () => clearTimeout(timeout);
    },
    [prefersReducedMotion],
  );

  // Interaction handlers to pause during interaction and resume 6s later
  const startInteraction = React.useCallback(() => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
    setIsInteracting(true);
  }, []);

  const endInteraction = React.useCallback(() => {
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
      interactionTimerRef.current = null;
    }, INTERACTION_RESUME_DELAY);
  }, []);

  // Cleanup interaction timer on unmount
  React.useEffect(() => {
    return () => {
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }
    };
  }, []);

  // Pure decision whether autoplay is active right now
  const isAutoplaying = shouldAutoplay({
    isPausedByUser,
    isHovered,
    isFocused,
    isInteracting,
    isDocumentHidden,
    isIntersecting,
    canScroll,
    totalSlides,
  });

  // Autoplay timer
  React.useEffect(() => {
    if (!isAutoplaying) return;

    const timer = setInterval(() => {
      const nextIndex = getNextSlideIndex(currentIndex, totalSlides);
      scrollToSlide(nextIndex);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [
    isAutoplaying,
    currentIndex,
    totalSlides,
    autoplayInterval,
    scrollToSlide,
  ]);

  const handlePrev = () => {
    startInteraction();
    const prevIndex = getPrevSlideIndex(currentIndex, totalSlides);
    scrollToSlide(prevIndex);
    endInteraction();
  };

  const handleNext = () => {
    startInteraction();
    const nextIndex = getNextSlideIndex(currentIndex, totalSlides);
    scrollToSlide(nextIndex);
    endInteraction();
  };

  const togglePausePlay = () => {
    setIsPausedByUser((prev) => !prev);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: ARIA carousel pattern requires role="region"
    <div
      ref={wrapperRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live={isAutoplaying ? "off" : "polite"}
      className={cn("relative w-full space-y-4", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      {/* Accessible Control Bar (only visible when slides overflow the viewport) */}
      {canScroll ? (
        <div className="flex items-center justify-end gap-2 px-1">
          <button
            type="button"
            onClick={togglePausePlay}
            aria-label={isPausedByUser ? "Start autoplay" : "Pause autoplay"}
            aria-pressed={isPausedByUser}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/80 bg-card px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:border-primary/40 hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isPausedByUser ? (
              <>
                <IconPlayerPlay
                  className="size-4 mr-1.5 text-primary"
                  aria-hidden="true"
                />
                <span>Play</span>
              </>
            ) : (
              <>
                <IconPlayerPause
                  className="size-4 mr-1.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/80 bg-card p-2.5 text-foreground shadow-2xs transition-colors hover:border-primary/40 hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <IconChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/80 bg-card p-2.5 text-foreground shadow-2xs transition-colors hover:border-primary/40 hover:bg-surface-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <IconChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Native Scroll-Snap Container */}
      <div
        ref={containerRef}
        onPointerDown={startInteraction}
        onPointerUp={endInteraction}
        onTouchStart={startInteraction}
        onTouchEnd={endInteraction}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          gapClassName,
        )}
      >
        {slides.map((slide, index) => (
          // biome-ignore lint/a11y/useSemanticElements: ARIA carousel pattern requires role="group" for slide
          <div
            key={
              React.isValidElement(slide) && slide.key != null
                ? slide.key
                : index
            }
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${totalSlides}`}
            className={cn("shrink-0 snap-start", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
