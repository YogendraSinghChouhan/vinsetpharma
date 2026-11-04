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

export type HomeImages = {
  hero: ImageSlot;
  banners: readonly ImageSlot[];
};

export type AboutImages = {
  hero: ImageSlot;
  values: ImageSlot;
  process: ImageSlot;
};

export type WhyUsImages = {
  hero: ImageSlot;
  principles: ImageSlot;
};

export const HOME_IMAGES: HomeImages = {
  hero: {
    src: "/images/home/hero.jpg",
    width: 1600,
    height: 988,
    alt: "Macro composition of pharmaceutical capsules and tablets arranged on a clean neutral surface",
  },
  banners: [
    {
      src: "/images/home/1.png",
      width: 1278,
      height: 795,
      alt: "Vinset pharmaceuticals manufacturing banner",
    },
    {
      src: "/images/home/2.png",
      width: 1276,
      height: 792,
      alt: "Vinset pharmaceuticals product manufacturing banner",
    },
    {
      src: "/images/home/3.png",
      width: 1258,
      height: 792,
      alt: "Vinset pharmaceuticals production banner",
    },
    {
      src: "/images/home/4.png",
      width: 1261,
      height: 793,
      alt: "Vinset pharmaceuticals quality manufacturing banner",
    },
    {
      src: "/images/home/5.png",
      width: 1259,
      height: 793,
      alt: "Vinset pharmaceuticals facility banner",
    },
    {
      src: "/images/home/6.png",
      width: 1263,
      height: 794,
      alt: "Vinset pharmaceuticals healthcare manufacturing banner",
    },
  ],
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
