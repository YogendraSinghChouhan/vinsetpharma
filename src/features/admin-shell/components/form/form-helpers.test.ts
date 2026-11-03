import { describe, expect, it } from "bun:test";
import { calculateCompleteness } from "./form-helpers";

describe("calculateCompleteness", () => {
  it("handles empty items array", () => {
    const res = calculateCompleteness([]);
    expect(res.completedCount).toBe(0);
    expect(res.totalCount).toBe(0);
    expect(res.percentage).toBe(100);
    expect(res.isComplete).toBe(true);
  });

  it("calculates partial completeness accurately", () => {
    const items = [
      { done: true },
      { done: true },
      { done: false },
      { done: false },
      { done: false },
    ];
    const res = calculateCompleteness(items);
    expect(res.completedCount).toBe(2);
    expect(res.totalCount).toBe(5);
    expect(res.percentage).toBe(40);
    expect(res.isComplete).toBe(false);
    expect(res.statusLabel).toBe("2 of 5 completed (40%)");
  });

  it("handles 100% completed items", () => {
    const items = [{ done: true }, { done: true }, { done: true }];
    const res = calculateCompleteness(items);
    expect(res.completedCount).toBe(3);
    expect(res.totalCount).toBe(3);
    expect(res.percentage).toBe(100);
    expect(res.isComplete).toBe(true);
    expect(res.statusLabel).toBe("3 of 3 completed (100%)");
  });

  it("handles 0% completed items", () => {
    const items = [{ done: false }, { done: false }];
    const res = calculateCompleteness(items);
    expect(res.completedCount).toBe(0);
    expect(res.totalCount).toBe(2);
    expect(res.percentage).toBe(0);
    expect(res.isComplete).toBe(false);
    expect(res.statusLabel).toBe("0 of 2 completed (0%)");
  });
});
