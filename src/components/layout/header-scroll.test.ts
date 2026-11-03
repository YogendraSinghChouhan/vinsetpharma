import { describe, expect, test } from "bun:test";
import { calculateHeaderState } from "./header-scroll";

describe("calculateHeaderState decision logic", () => {
  test("near top (<= 80px) is always visible", () => {
    // Exactly at top
    const atZero = calculateHeaderState({
      currentScrollY: 0,
      prevScrollY: 0,
      currentIsHidden: false,
    });
    expect(atZero.isHidden).toBe(false);
    expect(atZero.isScrolled).toBe(false);

    // Within top zone (e.g., 50px)
    const atFifty = calculateHeaderState({
      currentScrollY: 50,
      prevScrollY: 40,
      currentIsHidden: false,
    });
    expect(atFifty.isHidden).toBe(false);
    expect(atFifty.isScrolled).toBe(true);

    // At top boundary (80px), even if previously hidden
    const atEighty = calculateHeaderState({
      currentScrollY: 80,
      prevScrollY: 90,
      currentIsHidden: true,
    });
    expect(atEighty.isHidden).toBe(false);
    expect(atEighty.isScrolled).toBe(true);
  });

  test("negative scroll values (iOS overscroll bounce) are clamped to 0", () => {
    const bounce = calculateHeaderState({
      currentScrollY: -35,
      prevScrollY: -10,
      currentIsHidden: true,
    });
    expect(bounce.isHidden).toBe(false);
    expect(bounce.isScrolled).toBe(false);
  });

  test("scrolling DOWN past 80px by at least 8px hides the header", () => {
    // Scrolling from 80 to 90 (delta = +10 >= 8)
    const scrolledPastEighty = calculateHeaderState({
      currentScrollY: 90,
      prevScrollY: 80,
      currentIsHidden: false,
    });
    expect(scrolledPastEighty.isHidden).toBe(true);
    expect(scrolledPastEighty.isScrolled).toBe(true);

    // Deep down the page: from 300 to 315 (delta = +15 >= 8)
    const scrollingDownDeep = calculateHeaderState({
      currentScrollY: 315,
      prevScrollY: 300,
      currentIsHidden: false,
    });
    expect(scrollingDownDeep.isHidden).toBe(true);
    expect(scrollingDownDeep.isScrolled).toBe(true);
  });

  test("scrolling UP by at least 8px reveals the header", () => {
    // Scrolling up from 300 to 290 (delta = -10 <= -8)
    const scrolledUp = calculateHeaderState({
      currentScrollY: 290,
      prevScrollY: 300,
      currentIsHidden: true,
    });
    expect(scrolledUp.isHidden).toBe(false);
    expect(scrolledUp.isScrolled).toBe(true);

    // Exactly at threshold: delta = -8
    const exactUp = calculateHeaderState({
      currentScrollY: 192,
      prevScrollY: 200,
      currentIsHidden: true,
    });
    expect(exactUp.isHidden).toBe(false);
  });

  test("jitter smaller than 8px maintains existing state", () => {
    // Currently visible, micro downward movement of 4px (>80px)
    const smallDownWhenVisible = calculateHeaderState({
      currentScrollY: 124,
      prevScrollY: 120,
      currentIsHidden: false,
    });
    expect(smallDownWhenVisible.isHidden).toBe(false);

    // Currently hidden, micro downward movement of 3px
    const smallDownWhenHidden = calculateHeaderState({
      currentScrollY: 123,
      prevScrollY: 120,
      currentIsHidden: true,
    });
    expect(smallDownWhenHidden.isHidden).toBe(true);

    // Currently hidden, micro upward movement of 5px (< 8px)
    const smallUpWhenHidden = calculateHeaderState({
      currentScrollY: 145,
      prevScrollY: 150,
      currentIsHidden: true,
    });
    expect(smallUpWhenHidden.isHidden).toBe(true);

    // Currently visible, micro upward movement of 3px
    const smallUpWhenVisible = calculateHeaderState({
      currentScrollY: 147,
      prevScrollY: 150,
      currentIsHidden: false,
    });
    expect(smallUpWhenVisible.isHidden).toBe(false);
  });

  test("shadow state activates past shadowThreshold (8px) and deactivates at/below 8px", () => {
    expect(
      calculateHeaderState({
        currentScrollY: 8,
        prevScrollY: 0,
        currentIsHidden: false,
      }).isScrolled,
    ).toBe(false);

    expect(
      calculateHeaderState({
        currentScrollY: 9,
        prevScrollY: 0,
        currentIsHidden: false,
      }).isScrolled,
    ).toBe(true);
  });

  test("custom thresholds are respected when provided", () => {
    const customThresholds = {
      topThreshold: 120,
      deltaThreshold: 15,
      shadowThreshold: 12,
    };

    // 100px is <= 120px custom top threshold
    const nearCustomTop = calculateHeaderState({
      currentScrollY: 100,
      prevScrollY: 90,
      currentIsHidden: true,
      thresholds: customThresholds,
    });
    expect(nearCustomTop.isHidden).toBe(false);

    // Delta of 10px is < 15px custom delta threshold
    const underDelta = calculateHeaderState({
      currentScrollY: 160,
      prevScrollY: 150,
      currentIsHidden: false,
      thresholds: customThresholds,
    });
    expect(underDelta.isHidden).toBe(false);
  });
});
