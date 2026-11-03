import { describe, expect, it } from "bun:test";
import { FEATURED_PRODUCTS_LIMIT } from "./constants";
import {
  publishToggleSchema,
  reorderProductsSchema,
  setProductFeaturedSchema,
} from "./validation";

describe("Product Validation Schemas", () => {
  const validUuid = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
  const secondValidUuid = "8a2ceb3c-2a6c-4a9c-8acc-1a0c6a2cba5c";

  describe("FEATURED_PRODUCTS_LIMIT", () => {
    it("is configured to 8 as single source of truth", () => {
      expect(FEATURED_PRODUCTS_LIMIT).toBe(8);
    });
  });

  describe("setProductFeaturedSchema", () => {
    it("accepts valid input with featured = true", () => {
      const result = setProductFeaturedSchema.safeParse({
        id: validUuid,
        featured: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUuid);
        expect(result.data.featured).toBe(true);
      }
    });

    it("accepts valid input with featured = false", () => {
      const result = setProductFeaturedSchema.safeParse({
        id: validUuid,
        featured: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUuid);
        expect(result.data.featured).toBe(false);
      }
    });

    it("rejects invalid UUID format", () => {
      const result = setProductFeaturedSchema.safeParse({
        id: "invalid-uuid",
        featured: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-boolean featured value", () => {
      const result = setProductFeaturedSchema.safeParse({
        id: validUuid,
        featured: "yes",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing featured property", () => {
      const result = setProductFeaturedSchema.safeParse({
        id: validUuid,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("publishToggleSchema", () => {
    it("accepts valid input with published = true and false", () => {
      expect(
        publishToggleSchema.safeParse({ id: validUuid, published: true })
          .success,
      ).toBe(true);
      expect(
        publishToggleSchema.safeParse({ id: validUuid, published: false })
          .success,
      ).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(
        publishToggleSchema.safeParse({ id: "not-a-uuid", published: true })
          .success,
      ).toBe(false);
    });
  });

  describe("reorderProductsSchema", () => {
    it("accepts non-empty array of unique UUIDs", () => {
      const result = reorderProductsSchema.safeParse({
        ids: [validUuid, secondValidUuid],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty ids array", () => {
      const result = reorderProductsSchema.safeParse({
        ids: [],
      });
      expect(result.success).toBe(false);
    });

    it("rejects ids array with fewer than 2 items", () => {
      const result = reorderProductsSchema.safeParse({
        ids: [validUuid],
      });
      expect(result.success).toBe(false);
    });

    it("rejects duplicate ids in array", () => {
      const result = reorderProductsSchema.safeParse({
        ids: [validUuid, validUuid],
      });
      expect(result.success).toBe(false);
    });
  });
});
