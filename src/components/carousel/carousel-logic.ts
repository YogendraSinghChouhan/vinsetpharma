export const DEFAULT_AUTOPLAY_INTERVAL = 4500;
export const INTERACTION_RESUME_DELAY = 6000;

export interface AutoplayDecisionState {
  isPausedByUser: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isInteracting: boolean;
  isDocumentHidden: boolean;
  isIntersecting: boolean;
  canScroll: boolean;
  totalSlides: number;
}

/**
 * Pure decision function: determines if carousel should advance automatically.
 * Pauses on user toggle, hover, focus-within, pointer/touch/wheel interaction,
 * document visibility hidden, viewport exit, when slides don't overflow, or when <= 1 slide.
 */
export function shouldAutoplay(state: AutoplayDecisionState): boolean {
  if (!state.canScroll || state.totalSlides <= 1) {
    return false;
  }
  if (state.isPausedByUser) {
    return false;
  }
  if (state.isHovered) {
    return false;
  }
  if (state.isFocused) {
    return false;
  }
  if (state.isInteracting) {
    return false;
  }
  if (state.isDocumentHidden) {
    return false;
  }
  if (!state.isIntersecting) {
    return false;
  }
  return true;
}

/**
 * Calculates next slide index with smooth cyclic wrapping back to 0.
 */
export function getNextSlideIndex(
  currentIndex: number,
  totalSlides: number,
): number {
  if (totalSlides <= 0) return 0;
  if (currentIndex >= totalSlides - 1) {
    return 0;
  }
  return currentIndex + 1;
}

/**
 * Calculates previous slide index with smooth cyclic wrapping to the last slide.
 */
export function getPrevSlideIndex(
  currentIndex: number,
  totalSlides: number,
): number {
  if (totalSlides <= 0) return 0;
  if (currentIndex <= 0) {
    return totalSlides - 1;
  }
  return currentIndex - 1;
}
