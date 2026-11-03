import { describe, expect, it } from "bun:test";
import {
  formatShowingText,
  getAdminPageHref,
  parseAdminPageParam,
} from "./pagination-utils";

describe("parseAdminPageParam", () => {
  it("parses valid positive integer numbers and strings", () => {
    expect(parseAdminPageParam(1)).toBe(1);
    expect(parseAdminPageParam(5)).toBe(5);
    expect(parseAdminPageParam("3")).toBe(3);
    expect(parseAdminPageParam("42")).toBe(42);
  });

  it("extracts the first element when passed an array", () => {
    expect(parseAdminPageParam(["2", "5"])).toBe(2);
    expect(parseAdminPageParam(["10"])).toBe(10);
  });

  it("falls back to 1 for undefined or null inputs", () => {
    expect(parseAdminPageParam(undefined)).toBe(1);
    expect(parseAdminPageParam(null)).toBe(1);
  });

  it("falls back to 1 for invalid non-numeric inputs", () => {
    expect(parseAdminPageParam("invalid")).toBe(1);
    expect(parseAdminPageParam("")).toBe(1);
    expect(parseAdminPageParam({})).toBe(1);
    expect(parseAdminPageParam(Number.NaN)).toBe(1);
  });

  it("falls back to 1 for zero or negative numbers", () => {
    expect(parseAdminPageParam(0)).toBe(1);
    expect(parseAdminPageParam(-5)).toBe(1);
    expect(parseAdminPageParam("-1")).toBe(1);
  });

  it("falls back to 1 for floating point numbers", () => {
    expect(parseAdminPageParam("1.5")).toBe(1);
    expect(parseAdminPageParam(2.7)).toBe(1);
  });
});

describe("getAdminPageHref", () => {
  it("omits query parameter for page 1", () => {
    expect(getAdminPageHref("/admin/products", 1)).toBe("/admin/products");
    expect(getAdminPageHref("/admin/products", 0)).toBe("/admin/products");
    expect(getAdminPageHref("/admin/products", -1)).toBe("/admin/products");
  });

  it("adds ?page= for page > 1", () => {
    expect(getAdminPageHref("/admin/products", 2)).toBe(
      "/admin/products?page=2",
    );
    expect(getAdminPageHref("/admin/blogs", 5)).toBe("/admin/blogs?page=5");
  });

  it("preserves existing query parameters using &", () => {
    expect(getAdminPageHref("/admin/products?status=active", 3)).toBe(
      "/admin/products?status=active&page=3",
    );
  });
});

describe("formatShowingText", () => {
  it("formats first page range correctly", () => {
    expect(formatShowingText({ page: 1, pageSize: 20, totalItems: 45 })).toBe(
      "Showing 1 to 20 of 45",
    );
  });

  it("formats intermediate page range correctly", () => {
    expect(formatShowingText({ page: 2, pageSize: 20, totalItems: 45 })).toBe(
      "Showing 21 to 40 of 45",
    );
  });

  it("caps the upper boundary to totalItems on the final page", () => {
    expect(formatShowingText({ page: 3, pageSize: 20, totalItems: 45 })).toBe(
      "Showing 41 to 45 of 45",
    );
  });

  it("handles empty items count", () => {
    expect(formatShowingText({ page: 1, pageSize: 20, totalItems: 0 })).toBe(
      "Showing 0 of 0",
    );
  });
});
