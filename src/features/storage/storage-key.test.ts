import { describe, expect, it } from "bun:test";
import { postCoverImageKeySchema } from "@/features/blogs/validation";
import { categoryImageKeySchema } from "@/features/categories/validation";
import { productImageKeySchema } from "@/features/products/validation";
import { isValidStorageKey } from "./constants";

const validProductKey = "products/12345678-1234-1234-1234-123456789abc.jpg";
const validBlogKey = "blogs/87654321-4321-4321-4321-cba987654321.webp";
const validCategoryKey = "categories/11223344-5566-7788-99aa-bbccddeeff00.jpg";

describe("isValidStorageKey", () => {
  it("accepts valid keys in products, blogs, and categories directories with jpg, png, or webp", () => {
    expect(isValidStorageKey(validProductKey)).toBe(true);
    expect(isValidStorageKey(validBlogKey)).toBe(true);
    expect(isValidStorageKey(validCategoryKey)).toBe(true);
    expect(
      isValidStorageKey("categories/a0000000-0000-0000-0000-000000000001.png"),
    ).toBe(true);
    expect(
      isValidStorageKey("products/a0000000-0000-0000-0000-000000000001.png"),
    ).toBe(true);
  });

  it("rejects keys with unsupported directories", () => {
    expect(
      isValidStorageKey("avatars/12345678-1234-1234-1234-123456789abc.jpg"),
    ).toBe(false);
    expect(
      isValidStorageKey("uploads/12345678-1234-1234-1234-123456789abc.jpg"),
    ).toBe(false);
  });

  it("rejects keys with unsupported extensions", () => {
    expect(
      isValidStorageKey("categories/12345678-1234-1234-1234-123456789abc.svg"),
    ).toBe(false);
    expect(
      isValidStorageKey("products/12345678-1234-1234-1234-123456789abc.svg"),
    ).toBe(false);
    expect(
      isValidStorageKey("blogs/12345678-1234-1234-1234-123456789abc.gif"),
    ).toBe(false);
    expect(
      isValidStorageKey("blogs/12345678-1234-1234-1234-123456789abc.pdf"),
    ).toBe(false);
  });

  it("rejects non-UUID filenames and path traversal attempts", () => {
    expect(isValidStorageKey("categories/my-image.jpg")).toBe(false);
    expect(isValidStorageKey("products/my-image.jpg")).toBe(false);
    expect(isValidStorageKey("categories/../secret.jpg")).toBe(false);
    expect(
      isValidStorageKey(
        "categories/12345678-1234-1234-1234-123456789abc/nested.jpg",
      ),
    ).toBe(false);
  });
});

describe("product, blog, and category folder validation", () => {
  it("productImageKeySchema accepts products folder but rejects blogs and categories folders", () => {
    expect(productImageKeySchema.safeParse(validProductKey).success).toBe(true);

    const wrongFolderBlog = productImageKeySchema.safeParse(validBlogKey);
    expect(wrongFolderBlog.success).toBe(false);

    const wrongFolderCategory =
      productImageKeySchema.safeParse(validCategoryKey);
    expect(wrongFolderCategory.success).toBe(false);
  });

  it("postCoverImageKeySchema accepts blogs folder but rejects products and categories folders", () => {
    expect(postCoverImageKeySchema.safeParse(validBlogKey).success).toBe(true);

    const wrongFolderProduct =
      postCoverImageKeySchema.safeParse(validProductKey);
    expect(wrongFolderProduct.success).toBe(false);

    const wrongFolderCategory =
      postCoverImageKeySchema.safeParse(validCategoryKey);
    expect(wrongFolderCategory.success).toBe(false);
  });

  it("categoryImageKeySchema accepts categories folder but rejects products and blogs folders", () => {
    expect(categoryImageKeySchema.safeParse(validCategoryKey).success).toBe(
      true,
    );

    const wrongFolderProduct =
      categoryImageKeySchema.safeParse(validProductKey);
    expect(wrongFolderProduct.success).toBe(false);

    const wrongFolderBlog = categoryImageKeySchema.safeParse(validBlogKey);
    expect(wrongFolderBlog.success).toBe(false);
  });
});
