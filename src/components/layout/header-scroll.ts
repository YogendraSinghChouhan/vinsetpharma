/**
 * Header scroll state constants and decision logic.
 *
 * Rules:
 * - Scrolled down past 80px and downward movement >= 8px: hide header.
 * - Scrolled up by >= 8px, or within 80px of page top: reveal header.
 * - Box shadow active when scrolled > 8px from top.
 * - Negative scroll (e.g., iOS overscroll/bounce) is clamped to 0.
 */

export interface HeaderScrollThresholds {
  topThreshold: number;
  deltaThreshold: number;
  shadowThreshold: number;
}

export const HEADER_SCROLL_THRESHOLDS: HeaderScrollThresholds = {
  topThreshold: 80,
  deltaThreshold: 8,
  shadowThreshold: 8,
};

export interface HeaderScrollState {
  isHidden: boolean;
  isScrolled: boolean;
}

export interface HeaderScrollInput {
  currentScrollY: number;
  prevScrollY: number;
  currentIsHidden: boolean;
  thresholds?: HeaderScrollThresholds;
}

/**
 * Pure function computing whether the sticky header should be hidden or visible,
 * and whether the elevated box shadow should be rendered.
 */
export function calculateHeaderState({
  currentScrollY,
  prevScrollY,
  currentIsHidden,
  thresholds = HEADER_SCROLL_THRESHOLDS,
}: HeaderScrollInput): HeaderScrollState {
  // Clamp negative scroll values (iOS overscroll bounce)
  const clampedCurrentY = Math.max(0, currentScrollY);
  const clampedPrevY = Math.max(0, prevScrollY);

  const isScrolled = clampedCurrentY > thresholds.shadowThreshold;

  // Near the top of the page: always visible
  if (clampedCurrentY <= thresholds.topThreshold) {
    return {
      isHidden: false,
      isScrolled,
    };
  }

  const delta = clampedCurrentY - clampedPrevY;

  // User scrolled down past deltaThreshold: hide
  if (delta >= thresholds.deltaThreshold) {
    return {
      isHidden: true,
      isScrolled,
    };
  }

  // User scrolled up past deltaThreshold: reveal
  if (delta <= -thresholds.deltaThreshold) {
    return {
      isHidden: false,
      isScrolled,
    };
  }

  // Jitter smaller than deltaThreshold: maintain existing visibility
  return {
    isHidden: currentIsHidden,
    isScrolled,
  };
}
