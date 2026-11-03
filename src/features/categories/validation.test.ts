import { describe, expect, it } from "bun:test";
import {
  categoryIdSchema,
  categoryImageKeySchema,
  categoryNameSchema,
  createCategorySchema,
  reorderCategoriesSchema,
  updateCategorySchema,
} from "./validation";

const validUuid1 = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
const validUuid2 = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d";
const validUuid3 = "12345678-1234-4234-8234-123456789abc";
const validCategoryKey = "categories/12345678-1234-1234-1234-123456789abc.jpg";
const validProductKey = "products/12345678-1234-1234-1234-123456789abc.jpg";

describe("categoryIdSchema", () => {
  it("accepts valid UUIDs", () => {
    expect(categoryIdSchema.safeParse(validUuid1).success).toBe(true);
  });

  it("rejects non-UUID strings", () => {
    expect(categoryIdSchema.safeParse("not-a-uuid").success).toBe(false);
    expect(categoryIdSchema.safeParse("").success).toBe(false);
  });
});

describe("categoryNameSchema", () => {
  it("accepts valid category names between 2 and 60 characters", () => {
    expect(categoryNameSchema.safeParse("Tablets").success).toBe(true);
    expect(categoryNameSchema.safeParse("Syrups and Suspensions").success).toBe(
      true,
    );
    expect(categoryNameSchema.safeParse("AB").success).toBe(true);
    expect(categoryNameSchema.safeParse("A".repeat(60)).success).toBe(true);
  });

  it("trims whitespace before checking length", () => {
    const parsed = categoryNameSchema.safeParse("  Tablets  ");
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toBe("Tablets");
    }
  });

  it("rejects names shorter than 2 characters or longer than 60 characters", () => {
    expect(categoryNameSchema.safeParse("A").success).toBe(false);
    expect(categoryNameSchema.safeParse("").success).toBe(false);
    expect(categoryNameSchema.safeParse("  A  ").success).toBe(false);
    expect(categoryNameSchema.safeParse("A".repeat(61)).success).toBe(false);
  });
});

describe("categoryImageKeySchema", () => {
  it("accepts valid storage keys in categories folder", () => {
    expect(categoryImageKeySchema.safeParse(validCategoryKey).success).toBe(
      true,
    );
  });

  it("rejects keys from other folders or invalid formats", () => {
    expect(categoryImageKeySchema.safeParse(validProductKey).success).toBe(
      false,
    );
    expect(
      categoryImageKeySchema.safeParse(
        "blogs/12345678-1234-1234-1234-123456789abc.jpg",
      ).success,
    ).toBe(false);
    expect(
      categoryImageKeySchema.safeParse("categories/invalid.png").success,
    ).toBe(false);
  });
});

describe("createCategorySchema", () => {
  it("accepts payload with null imageKey", () => {
    const res = createCategorySchema.safeParse({
      name: "Tablets",
      imageKey: null,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.imageKey).toBeNull();
    }
  });

  it("accepts payload with undefined or omitted imageKey and transforms to null", () => {
    const res = createCategorySchema.safeParse({
      name: "Capsules",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.imageKey).toBeNull();
    }
  });

  it("accepts payload with valid category imageKey", () => {
    const res = createCategorySchema.safeParse({
      name: "Injectables",
      imageKey: validCategoryKey,
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.imageKey).toBe(validCategoryKey);
    }
  });

  it("rejects invalid name or invalid imageKey", () => {
    expect(
      createCategorySchema.safeParse({
        name: "",
        imageKey: null,
      }).success,
    ).toBe(false);

    expect(
      createCategorySchema.safeParse({
        name: "Valid Name",
        imageKey: validProductKey,
      }).success,
    ).toBe(false);
  });
});

describe("updateCategorySchema", () => {
  it("accepts valid update input", () => {
    const res = updateCategorySchema.safeParse({
      id: validUuid1,
      name: "Tablets & Pills",
      imageKey: validCategoryKey,
    });
    expect(res.success).toBe(true);
  });

  it("rejects update missing id or with invalid id", () => {
    expect(
      updateCategorySchema.safeParse({
        id: "invalid-id",
        name: "Tablets",
        imageKey: null,
      }).success,
    ).toBe(false);
  });
});

describe("reorderCategoriesSchema", () => {
  it("accepts non-empty array of unique UUIDs", () => {
    const res = reorderCategoriesSchema.safeParse({
      ids: [validUuid1, validUuid2, validUuid3],
    });
    expect(res.success).toBe(true);
  });

  it("rejects empty array of IDs", () => {
    const res = reorderCategoriesSchema.safeParse({
      ids: [],
    });
    expect(res.success).toBe(false);
  });

  it("rejects duplicate IDs", () => {
    const res = reorderCategoriesSchema.safeParse({
      ids: [validUuid1, validUuid2, validUuid1],
    });
    expect(res.success).toBe(false);
  });

  it("rejects non-UUID entries in array", () => {
    const res = reorderCategoriesSchema.safeParse({
      ids: [validUuid1, "not-a-uuid"],
    });
    expect(res.success).toBe(false);
  });
});
