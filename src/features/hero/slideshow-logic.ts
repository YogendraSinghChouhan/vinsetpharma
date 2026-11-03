import type { HeroSlideFocus } from "./constants";

export const SLIDE_DISPLAY_DURATION_MS = 5000;
export const SLIDE_CROSSFADE_DURATION_MS = 1100;
export const RESUME_AFTER_INTERACTION_MS = 3000;

export interface SlideDecisionInput {
  currentIndex: number;
  slideCount: number;
  loadedIndices: readonly number[];
  failedIndices: readonly number[];
  isPaused: boolean;
  isHidden: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Pure decision function determining whether the slideshow should advance
 * and which slide index should be shown next.
 *
 * Rules:
 * - Returns null when only 1 or 0 slides exist (no rotation).
 * - Returns null when paused, tab hidden, hero off-screen, or prefers-reduced-motion is active.
 * - Checks candidate slides in order starting from currentIndex + 1.
 * - Skips failed slides automatically.
 * - Waits (returns null) if the immediately next eligible slide is not yet loaded and decoded.
 */
export function computeNextSlideIndex({
  currentIndex,
  slideCount,
  loadedIndices,
  failedIndices,
  isPaused,
  isHidden,
  prefersReducedMotion,
}: SlideDecisionInput): number | null {
  if (slideCount <= 1) {
    return null;
  }

  if (isPaused || isHidden || prefersReducedMotion) {
    return null;
  }

  const loadedSet = new Set(loadedIndices);
  const failedSet = new Set(failedIndices);

  for (let offset = 1; offset < slideCount; offset++) {
    const candidate = (currentIndex + offset) % slideCount;

    // Skip permanently failed slides
    if (failedSet.has(candidate)) {
      continue;
    }

    // Next slide must be loaded and decoded before rotation begins
    if (loadedSet.has(candidate)) {
      return candidate;
    }

    // Next candidate in sequence is not loaded yet -> wait
    return null;
  }

  return null;
}

/**
 * Returns CSS transform-origin coordinate matching focus alignment.
 */
export function getSlideTransformOrigin(focus: HeroSlideFocus): string {
  switch (focus) {
    case "left":
      return "0% 50%";
    case "right":
      return "100% 50%";
    default:
      return "50% 50%";
  }
}
