import { describe, expect, it } from "bun:test";
import {
  computeNextSlideIndex,
  getSlideTransformOrigin,
} from "./slideshow-logic";

describe("computeNextSlideIndex", () => {
  it("returns null when slideCount is 0 or 1", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 0,
        loadedIndices: [],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBeNull();

    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 1,
        loadedIndices: [0],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBeNull();
  });

  it("returns null when isPaused is true", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: true,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBeNull();
  });

  it("returns null when isHidden is true (tab hidden or off-screen)", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: false,
        isHidden: true,
        prefersReducedMotion: false,
      }),
    ).toBeNull();
  });

  it("returns null when prefersReducedMotion is true", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: true,
      }),
    ).toBeNull();
  });

  it("advances to the next slide when it is loaded and decoded", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBe(1);

    expect(
      computeNextSlideIndex({
        currentIndex: 1,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBe(2);
  });

  it("wraps around from the last slide to the first slide", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 2,
        slideCount: 3,
        loadedIndices: [0, 1, 2],
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBe(0);
  });

  it("waits (returns null) when the next candidate is not yet loaded", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0], // slide 1 not yet loaded
        failedIndices: [],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBeNull();
  });

  it("skips failed slides and advances to the next loaded slide", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0, 2],
        failedIndices: [1], // slide 1 failed to load
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBe(2);
  });

  it("returns null when all other candidate slides have failed", () => {
    expect(
      computeNextSlideIndex({
        currentIndex: 0,
        slideCount: 3,
        loadedIndices: [0],
        failedIndices: [1, 2],
        isPaused: false,
        isHidden: false,
        prefersReducedMotion: false,
      }),
    ).toBeNull();
  });
});

describe("getSlideTransformOrigin", () => {
  it("returns correct coordinates for left, right, and center focus", () => {
    expect(getSlideTransformOrigin("left")).toBe("0% 50%");
    expect(getSlideTransformOrigin("right")).toBe("100% 50%");
    expect(getSlideTransformOrigin("center")).toBe("50% 50%");
  });
});
