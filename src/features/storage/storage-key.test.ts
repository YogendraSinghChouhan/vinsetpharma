import { describe, expect, it } from "bun:test";
import { postCoverImageKeySchema } from "@/features/blogs/validation";
import { productImageKeySchema } from "@/features/products/validation";
import { isValidStorageKey } from "./constants";

const validProductKey = "products/12345678-1234-1234-1234-123456789abc.jpg";
const validBlogKey = "blogs/87654321-4321-4321-4321-cba987654321.webp";

describe("isValidStorageKey", () => {
  it("accepts valid keys in products and blogs directories with jpg, png, or webp", () => {
    expect(isValidStorageKey(validProductKey)).toBe(true);
    expect(isValidStorageKey(validBlogKey)).toBe(true);
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
    expect(isValidStorageKey("products/my-image.jpg")).toBe(false);
    expect(isValidStorageKey("products/../secret.jpg")).toBe(false);
    expect(
      isValidStorageKey(
        "products/12345678-1234-1234-1234-123456789abc/nested.jpg",
      ),
    ).toBe(false);
  });
});

describe("product and post folder validation", () => {
  it("productImageKeySchema accepts products folder but rejects blogs folder", () => {
    expect(productImageKeySchema.safeParse(validProductKey).success).toBe(true);

    const wrongFolder = productImageKeySchema.safeParse(validBlogKey);
    expect(wrongFolder.success).toBe(false);
  });

  it("postCoverImageKeySchema accepts blogs folder but rejects products folder", () => {
    expect(postCoverImageKeySchema.safeParse(validBlogKey).success).toBe(true);

    const wrongFolder = postCoverImageKeySchema.safeParse(validProductKey);
    expect(wrongFolder.success).toBe(false);
  });
});
