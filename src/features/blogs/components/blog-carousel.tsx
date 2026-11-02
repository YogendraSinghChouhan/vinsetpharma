"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type BlogCarouselProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export function BlogCarousel({
  children,
  className,
  speed = 1,
}: BlogCarouselProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const plugins = React.useMemo(() => {
    if (prefersReducedMotion) return [];
    return [
      AutoScroll({
        speed,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ];
  }, [speed, prefersReducedMotion]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="-ml-4 sm:-ml-6 py-2">
          {children}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
