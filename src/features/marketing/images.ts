/**
 * Every statement and image assignment in this file must be confirmed by the client before launch.
 * Typed configuration for marketing page imagery with local asset paths and descriptive alt text.
 */

export type ImageSlot = {
  src: string;
  width: number;
  height: number;
  alt: string;
} | null;

export type AboutImages = {
  hero: ImageSlot;
  values: ImageSlot;
  process: ImageSlot;
};

export type WhyUsImages = {
  hero: ImageSlot;
  principles: ImageSlot;
};

export const ABOUT_IMAGES: AboutImages = {
  hero: {
    src: "/images/about/hero.jpg",
    width: 1600,
    height: 1119,
    alt: "Arrangement of sealed medication blister packages on a clean neutral surface",
  },
  values: {
    src: "/images/about/values.jpg",
    width: 1200,
    height: 800,
    alt: "Close-up of graduated glass scientific beakers on a clean reflective surface",
  },
  process: {
    src: "/images/about/process.jpg",
    width: 1200,
    height: 800,
    alt: "Flat-lay composition of various pharmaceutical capsules and tablets",
  },
};

export const WHY_US_IMAGES: WhyUsImages = {
  hero: {
    src: "/images/why-us/hero.jpg",
    width: 1600,
    height: 1067,
    alt: "Foil blister packaging containing pharmaceutical tablets arranged in rows",
  },
  principles: {
    src: "/images/why-us/principles.jpg",
    width: 1200,
    height: 801,
    alt: "Pharmacy shelving displaying uniform medicine containers in soft focus",
  },
};
