import { describe, expect, it } from "bun:test";
import {
  DEFAULT_AUTOPLAY_INTERVAL,
  getNextSlideIndex,
  getPrevSlideIndex,
  INTERACTION_RESUME_DELAY,
  shouldAutoplay,
} from "./carousel-logic";

describe("Carousel Pure Logic", () => {
  it("exports correct timing constants", () => {
    expect(DEFAULT_AUTOPLAY_INTERVAL).toBe(4500);
    expect(INTERACTION_RESUME_DELAY).toBe(6000);
  });

  describe("getNextSlideIndex", () => {
    it("advances to the next slide when not at the end", () => {
      expect(getNextSlideIndex(0, 5)).toBe(1);
      expect(getNextSlideIndex(1, 5)).toBe(2);
      expect(getNextSlideIndex(3, 5)).toBe(4);
    });

    it("wraps back smoothly to index 0 when at the last slide", () => {
      expect(getNextSlideIndex(4, 5)).toBe(0);
      expect(getNextSlideIndex(9, 10)).toBe(0);
    });

    it("handles boundary cases (0 or 1 slides, out of range)", () => {
      expect(getNextSlideIndex(0, 0)).toBe(0);
      expect(getNextSlideIndex(0, 1)).toBe(0);
      expect(getNextSlideIndex(10, 5)).toBe(0);
    });
  });

  describe("getPrevSlideIndex", () => {
    it("moves to the previous slide when not at the beginning", () => {
      expect(getPrevSlideIndex(4, 5)).toBe(3);
      expect(getPrevSlideIndex(2, 5)).toBe(1);
      expect(getPrevSlideIndex(1, 5)).toBe(0);
    });

    it("wraps around to the last slide when at index 0", () => {
      expect(getPrevSlideIndex(0, 5)).toBe(4);
      expect(getPrevSlideIndex(0, 10)).toBe(9);
    });

    it("handles boundary cases (0 or 1 slides)", () => {
      expect(getPrevSlideIndex(0, 0)).toBe(0);
      expect(getPrevSlideIndex(0, 1)).toBe(0);
    });
  });

  describe("shouldAutoplay decision function", () => {
    const baseState = {
      isPausedByUser: false,
      isHovered: false,
      isFocused: false,
      isInteracting: false,
      isDocumentHidden: false,
      isIntersecting: true,
      canScroll: true,
      totalSlides: 5,
    };

    it("returns true when all conditions permit autoplay", () => {
      expect(shouldAutoplay(baseState)).toBe(true);
    });

    it("pauses when user toggled pause", () => {
      expect(shouldAutoplay({ ...baseState, isPausedByUser: true })).toBe(
        false,
      );
    });

    it("pauses on hover", () => {
      expect(shouldAutoplay({ ...baseState, isHovered: true })).toBe(false);
    });

    it("pauses on focus-within", () => {
      expect(shouldAutoplay({ ...baseState, isFocused: true })).toBe(false);
    });

    it("pauses on active pointer/touch/scroll interaction", () => {
      expect(shouldAutoplay({ ...baseState, isInteracting: true })).toBe(false);
    });

    it("pauses when document visibility is hidden", () => {
      expect(shouldAutoplay({ ...baseState, isDocumentHidden: true })).toBe(
        false,
      );
    });

    it("pauses when carousel is off-screen (not intersecting)", () => {
      expect(shouldAutoplay({ ...baseState, isIntersecting: false })).toBe(
        false,
      );
    });

    it("pauses when slides do not overflow the container (canScroll is false)", () => {
      expect(shouldAutoplay({ ...baseState, canScroll: false })).toBe(false);
    });

    it("pauses when there is only 1 or 0 slides", () => {
      expect(shouldAutoplay({ ...baseState, totalSlides: 1 })).toBe(false);
      expect(shouldAutoplay({ ...baseState, totalSlides: 0 })).toBe(false);
    });
  });
});
