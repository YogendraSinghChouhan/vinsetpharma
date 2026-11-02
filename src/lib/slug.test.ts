import { describe, expect, it } from "bun:test";
import { isUniqueViolation, SLUG_MAX_LENGTH, slugify } from "./slug";

describe("slugify", () => {
  it("converts accented characters to ASCII equivalents", () => {
    expect(slugify("Café & Crème Brûlée")).toBe("cafe-creme-brulee");
    expect(slugify("Médicament Générique")).toBe("medicament-generique");
  });

  it("replaces symbols and punctuation with hyphens without duplicating", () => {
    expect(slugify("Paracetamol 500mg @ Hospital (Pack #1)")).toBe(
      "paracetamol-500mg-hospital-pack-1",
    );
    expect(slugify("Special!@#$%^&*()_+Symbols")).toBe("special-symbols");
  });

  it("falls back when input is empty or contains no alphanumeric characters", () => {
    expect(slugify("")).toBe("item");
    expect(slugify("   ")).toBe("item");
    expect(slugify("!@#$%^&*()")).toBe("item");
    expect(slugify("!@#$", "product")).toBe("product");
  });

  it("caps the slug length at SLUG_MAX_LENGTH (80 characters) and strips trailing hyphens", () => {
    const longTitle = "A".repeat(100);
    const result = slugify(longTitle);
    expect(result.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(result).toBe("a".repeat(SLUG_MAX_LENGTH));
    expect(result.endsWith("-")).toBe(false);

    // If slicing ends on a hyphen, it should strip it
    const titleWithHyphenCutoff = "word-".repeat(20);
    const cutSlug = slugify(titleWithHyphenCutoff);
    expect(cutSlug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(cutSlug.endsWith("-")).toBe(false);
  });
});

describe("isUniqueViolation", () => {
  it("detects code 23505 directly on the error object", () => {
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
  });

  it("detects 23505 or unique constraint in error message", () => {
    expect(
      isUniqueViolation(
        new Error("duplicate key value violates unique constraint"),
      ),
    ).toBe(true);
    expect(isUniqueViolation(new Error("Error code 23505"))).toBe(true);
  });

  it("walks the error.cause chain to inspect wrapped driver errors (DrizzleQueryError)", () => {
    const rootDriverError = {
      code: "23505",
      detail: "Key (slug)=(test) already exists.",
    };
    const wrappedError = new Error("Failed query: INSERT INTO products ...");
    (wrappedError as unknown as { cause: unknown }).cause = rootDriverError;

    expect(isUniqueViolation(wrappedError)).toBe(true);

    const deeplyNested = new Error("Top level failure");
    (deeplyNested as unknown as { cause: unknown }).cause = {
      cause: wrappedError,
    };
    expect(isUniqueViolation(deeplyNested)).toBe(true);
  });

  it("returns false for non-unique-violation errors", () => {
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation(undefined)).toBe(false);
    expect(isUniqueViolation(new Error("Connection timeout"))).toBe(false);
    expect(isUniqueViolation({ code: "42P01" })).toBe(false); // undefined_table
  });
});
