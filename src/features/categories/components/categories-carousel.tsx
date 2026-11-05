"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HOME_COPY } from "@/features/marketing/content";
import type { PublicCategory } from "../public-data";
import { CategoryCard } from "./category-card";

type CategoriesCarouselProps = {
  categories: PublicCategory[];
};

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", dragFree: true, loop: false }}
      className="w-full"
    >
      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] lg:gap-16">
        <div className="order-last min-w-0 lg:order-first">
          <CarouselContent className="-ml-4 py-2">
            {categories.map((category, index) => (
              <CarouselItem
                key={category.id}
                className="basis-[88%] pl-4 sm:basis-1/2"
              >
                <CategoryCard category={category} priority={index < 2} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <div className="order-first flex flex-col gap-4 lg:order-last lg:pb-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Explore our range
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Categories
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HOME_COPY.categoryIntro}
          </p>
          <div className="mt-2 hidden items-center gap-3 lg:flex">
            <CarouselPrevious className="static size-11 translate-y-0 border-primary/20 bg-white text-primary shadow-sm hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="static size-11 translate-y-0 border-primary/20 bg-white text-primary shadow-sm hover:bg-primary hover:text-primary-foreground" />
          </div>
        </div>
      </div>
    </Carousel>
  );
}
