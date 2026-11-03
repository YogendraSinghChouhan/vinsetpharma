export const HERO_MAX_SLIDES = 6;
export const HERO_RECOMMENDED_WIDTH = 1920;
export const HERO_MIN_ASPECT = 1.2;
export const HERO_RECOMMENDED_MAX_BYTES = 1024 * 1024; // 1 MB (advice text only)
export const HERO_ALT_MAX_LENGTH = 160;

export const HERO_CACHE_TAG = "hero";

export const HERO_FOCUS_VALUES = ["left", "center", "right"] as const;
export type HeroSlideFocus = (typeof HERO_FOCUS_VALUES)[number];
