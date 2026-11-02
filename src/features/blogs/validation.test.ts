import { describe, expect, it } from "bun:test";
import { postSlugSchema } from "./validation";

describe("postSlugSchema", () => {
  it("accepts valid lowercase alphanumeric slugs with single hyphens", () => {
    expect(postSlugSchema.safeParse("valid-slug-123").success).toBe(true);
    expect(postSlugSchema.safeParse("pharma-research-2026").success).toBe(true);
    expect(postSlugSchema.safeParse("abc").success).toBe(true);
  });

  it("rejects slugs with double / consecutive hyphens", () => {
    const result = postSlugSchema.safeParse("invalid--slug");
    expect(result.success).toBe(false);
  });

  it("rejects uppercase letters", () => {
    expect(postSlugSchema.safeParse("Invalid-slug").success).toBe(false);
    expect(postSlugSchema.safeParse("UPPERCASE").success).toBe(false);
    expect(postSlugSchema.safeParse("slug-With-Upper").success).toBe(false);
  });

  it("rejects leading or trailing hyphens", () => {
    expect(postSlugSchema.safeParse("-leading-hyphen").success).toBe(false);
    expect(postSlugSchema.safeParse("trailing-hyphen-").success).toBe(false);
  });

  it("rejects slugs that violate length constraints (3 to 100 characters)", () => {
    expect(postSlugSchema.safeParse("ab").success).toBe(false); // too short
    const tooLong = "a".repeat(101);
    expect(postSlugSchema.safeParse(tooLong).success).toBe(false);
  });

  it("rejects special characters, spaces, and punctuation", () => {
    expect(postSlugSchema.safeParse("slug with spaces").success).toBe(false);
    expect(postSlugSchema.safeParse("slug_with_underscore").success).toBe(
      false,
    );
    expect(postSlugSchema.safeParse("slug!@#$").success).toBe(false);
  });
});
