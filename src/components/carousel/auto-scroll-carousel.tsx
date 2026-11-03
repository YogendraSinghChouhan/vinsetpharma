"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type AutoScrollCarouselProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export function AutoScrollCarousel({
  children,
  className,
  speed = 1,
}: AutoScrollCarouselProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
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
  }, [prefersReducedMotion, speed]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <Carousel
        opts={{ align: "start", loop: true, dragFree: true }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-2 sm:-ml-6">
          {children}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
