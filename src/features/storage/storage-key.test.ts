import { describe, expect, it } from "bun:test";
import { postCoverImageKeySchema } from "@/features/blogs/validation";
import { categoryImageKeySchema } from "@/features/categories/validation";
import { productImageKeySchema } from "@/features/products/validation";
import {
  isValidMediaKey,
  isValidMediaPosterKey,
  isValidStorageKey,
} from "./constants";
import { uploadRequestSchema } from "./schema";

const validProductKey = "products/12345678-1234-1234-1234-123456789abc.jpg";
const validBlogKey = "blogs/87654321-4321-4321-4321-cba987654321.webp";
const validCategoryKey = "categories/11223344-5566-7788-99aa-bbccddeeff00.jpg";
const validMediaImageKey = "media/22334455-6677-8899-aabb-ccddeeff0011.jpg";
const validMediaVideoMp4 = "media/33445566-7788-99aa-bbcc-ddeeff001122.mp4";
const validMediaVideoWebm = "media/44556677-8899-99aa-bbcc-ddeeff001133.webm";

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

  it("accepts valid media keys for photos and videos", () => {
    expect(isValidStorageKey(validMediaImageKey)).toBe(true);
    expect(isValidStorageKey(validMediaVideoMp4)).toBe(true);
    expect(isValidStorageKey(validMediaVideoWebm)).toBe(true);
    expect(
      isValidStorageKey("media/11111111-2222-3333-4444-555555555555.png"),
    ).toBe(true);
    expect(
      isValidStorageKey("media/11111111-2222-3333-4444-555555555555.webp"),
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
      isValidStorageKey("products/12345678-1234-1234-1234-123456789abc.mp4"),
    ).toBe(false);
    expect(
      isValidStorageKey("blogs/12345678-1234-1234-1234-123456789abc.mp4"),
    ).toBe(false);
    expect(
      isValidStorageKey("media/12345678-1234-1234-1234-123456789abc.avi"),
    ).toBe(false);
    expect(
      isValidStorageKey("media/12345678-1234-1234-1234-123456789abc.mkv"),
    ).toBe(false);
    expect(
      isValidStorageKey("media/12345678-1234-1234-1234-123456789abc.gif"),
    ).toBe(false);
  });

  it("rejects non-UUID filenames and path traversal attempts", () => {
    expect(isValidStorageKey("categories/my-image.jpg")).toBe(false);
    expect(isValidStorageKey("products/my-image.jpg")).toBe(false);
    expect(isValidStorageKey("media/my-video.mp4")).toBe(false);
    expect(isValidStorageKey("media/../secret.mp4")).toBe(false);
  });
});

describe("isValidMediaKey and isValidMediaPosterKey", () => {
  it("isValidMediaKey accepts photos and videos in media/ folder", () => {
    expect(isValidMediaKey(validMediaImageKey)).toBe(true);
    expect(isValidMediaKey(validMediaVideoMp4)).toBe(true);
    expect(isValidMediaKey(validMediaVideoWebm)).toBe(true);
    expect(isValidMediaKey(validProductKey)).toBe(false);
    expect(isValidMediaKey(validBlogKey)).toBe(false);
  });

  it("isValidMediaPosterKey accepts only image extensions in media/ folder", () => {
    expect(isValidMediaPosterKey(validMediaImageKey)).toBe(true);
    expect(
      isValidMediaPosterKey("media/22334455-6677-8899-aabb-ccddeeff0011.png"),
    ).toBe(true);
    expect(isValidMediaPosterKey(validMediaVideoMp4)).toBe(false);
    expect(isValidMediaPosterKey(validMediaVideoWebm)).toBe(false);
  });
});

describe("folder isolation across features", () => {
  it("productImageKeySchema accepts products folder but rejects media, blogs and categories", () => {
    expect(productImageKeySchema.safeParse(validProductKey).success).toBe(true);
    expect(productImageKeySchema.safeParse(validMediaImageKey).success).toBe(
      false,
    );
    expect(productImageKeySchema.safeParse(validMediaVideoMp4).success).toBe(
      false,
    );
    expect(productImageKeySchema.safeParse(validBlogKey).success).toBe(false);
    expect(productImageKeySchema.safeParse(validCategoryKey).success).toBe(
      false,
    );
  });

  it("postCoverImageKeySchema accepts blogs folder but rejects media, products and categories", () => {
    expect(postCoverImageKeySchema.safeParse(validBlogKey).success).toBe(true);
    expect(postCoverImageKeySchema.safeParse(validMediaImageKey).success).toBe(
      false,
    );
    expect(postCoverImageKeySchema.safeParse(validProductKey).success).toBe(
      false,
    );
    expect(postCoverImageKeySchema.safeParse(validCategoryKey).success).toBe(
      false,
    );
  });

  it("categoryImageKeySchema accepts categories folder but rejects media, products and blogs", () => {
    expect(categoryImageKeySchema.safeParse(validCategoryKey).success).toBe(
      true,
    );
    expect(categoryImageKeySchema.safeParse(validMediaImageKey).success).toBe(
      false,
    );
    expect(categoryImageKeySchema.safeParse(validProductKey).success).toBe(
      false,
    );
    expect(categoryImageKeySchema.safeParse(validBlogKey).success).toBe(false);
  });
});

describe("uploadRequestSchema validation", () => {
  it("validates standard image upload limits for products (5 MB)", () => {
    expect(
      uploadRequestSchema.safeParse({
        purpose: "products",
        contentType: "image/jpeg",
        size: 5 * 1024 * 1024,
      }).success,
    ).toBe(true);

    expect(
      uploadRequestSchema.safeParse({
        purpose: "products",
        contentType: "image/jpeg",
        size: 5 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false);
  });

  it("validates media purpose with 10 MB images and 100 MB videos", () => {
    // 10 MB image
    expect(
      uploadRequestSchema.safeParse({
        purpose: "media",
        contentType: "image/jpeg",
        size: 10 * 1024 * 1024,
      }).success,
    ).toBe(true);

    // 10 MB + 1 byte image fails
    expect(
      uploadRequestSchema.safeParse({
        purpose: "media",
        contentType: "image/jpeg",
        size: 10 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false);

    // 100 MB mp4 video
    expect(
      uploadRequestSchema.safeParse({
        purpose: "media",
        contentType: "video/mp4",
        size: 100 * 1024 * 1024,
      }).success,
    ).toBe(true);

    // 100 MB + 1 byte video fails
    expect(
      uploadRequestSchema.safeParse({
        purpose: "media",
        contentType: "video/mp4",
        size: 100 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false);

    // video not allowed for products
    expect(
      uploadRequestSchema.safeParse({
        purpose: "products",
        contentType: "video/mp4",
        size: 1024,
      }).success,
    ).toBe(false);
  });
});
