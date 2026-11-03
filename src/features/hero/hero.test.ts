import { describe, expect, it } from "bun:test";
import {
  createHeroSlidesBatchSchema,
  heroImageKeySchema,
  heroSlideFocusSchema,
  heroSlideIdSchema,
  heroSlideItemInputSchema,
  reorderHeroSlidesSchema,
  requestHeroUploadSchema,
  updateHeroSlideSchema,
} from "./validation";

const validUuid = "12345678-1234-4234-8234-123456789abc";
const validHeroKey = `hero/${validUuid}.jpg`;
const validHeroKeyWebp = `hero/${validUuid}.webp`;
const validHeroKeyPng = `hero/${validUuid}.png`;

describe("heroImageKeySchema", () => {
  it("accepts valid hero storage keys with jpg, png, or webp", () => {
    expect(heroImageKeySchema.safeParse(validHeroKey).success).toBe(true);
    expect(heroImageKeySchema.safeParse(validHeroKeyWebp).success).toBe(true);
    expect(heroImageKeySchema.safeParse(validHeroKeyPng).success).toBe(true);
  });

  it("rejects hero keys with invalid extensions", () => {
    expect(heroImageKeySchema.safeParse(`hero/${validUuid}.mp4`).success).toBe(
      false,
    );
    expect(heroImageKeySchema.safeParse(`hero/${validUuid}.gif`).success).toBe(
      false,
    );
    expect(heroImageKeySchema.safeParse(`hero/${validUuid}.svg`).success).toBe(
      false,
    );
  });

  it("rejects non-hero directory keys", () => {
    expect(
      heroImageKeySchema.safeParse(`products/${validUuid}.jpg`).success,
    ).toBe(false);
    expect(heroImageKeySchema.safeParse(`media/${validUuid}.jpg`).success).toBe(
      false,
    );
    expect(
      heroImageKeySchema.safeParse(`categories/${validUuid}.jpg`).success,
    ).toBe(false);
  });

  it("rejects malformed or non-uuid keys", () => {
    expect(heroImageKeySchema.safeParse("hero/my-photo.jpg").success).toBe(
      false,
    );
    expect(
      heroImageKeySchema.safeParse(`hero/../${validUuid}.jpg`).success,
    ).toBe(false);
  });
});

describe("heroSlideFocusSchema", () => {
  it("accepts left, center, right", () => {
    expect(heroSlideFocusSchema.safeParse("left").success).toBe(true);
    expect(heroSlideFocusSchema.safeParse("center").success).toBe(true);
    expect(heroSlideFocusSchema.safeParse("right").success).toBe(true);
  });

  it("rejects invalid focus values", () => {
    expect(heroSlideFocusSchema.safeParse("top").success).toBe(false);
    expect(heroSlideFocusSchema.safeParse("bottom").success).toBe(false);
    expect(heroSlideFocusSchema.safeParse("").success).toBe(false);
  });
});

describe("requestHeroUploadSchema", () => {
  it("accepts valid image uploads up to 10 MB", () => {
    expect(
      requestHeroUploadSchema.safeParse({
        contentType: "image/jpeg",
        size: 10 * 1024 * 1024,
      }).success,
    ).toBe(true);

    expect(
      requestHeroUploadSchema.safeParse({
        contentType: "image/webp",
        size: 1024,
      }).success,
    ).toBe(true);
  });

  it("rejects uploads exceeding 10 MB", () => {
    expect(
      requestHeroUploadSchema.safeParse({
        contentType: "image/jpeg",
        size: 10 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false);
  });

  it("rejects unsupported content types", () => {
    expect(
      requestHeroUploadSchema.safeParse({
        contentType: "image/gif",
        size: 1024,
      }).success,
    ).toBe(false);

    expect(
      requestHeroUploadSchema.safeParse({
        contentType: "video/mp4",
        size: 1024,
      }).success,
    ).toBe(false);
  });
});

describe("heroSlideItemInputSchema", () => {
  it("accepts valid landscape slide item", () => {
    const result = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1920,
      height: 1080,
      alt: "Laboratory research facility",
      focus: "center",
    });
    expect(result.success).toBe(true);
  });

  it("defaults focus to center and converts empty alt to null", () => {
    const result = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1920,
      height: 1080,
      alt: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.focus).toBe("center");
      expect(result.data.alt).toBeNull();
    }
  });

  it("accepts images below the former width recommendation", () => {
    const result = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 738,
      height: 615,
    });
    expect(result.success).toBe(true);
  });

  it("rejects aspect ratio below 1.2 (square or portrait)", () => {
    // 1400x1400 -> aspect 1.0 < 1.2
    const squareResult = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1400,
      height: 1400,
    });
    expect(squareResult.success).toBe(false);

    // 1280x1600 -> aspect 0.8 < 1.2
    const portraitResult = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1280,
      height: 1600,
    });
    expect(portraitResult.success).toBe(false);

    // 1280x1066 -> aspect 1.2007 >= 1.2 -> valid
    const validAspectResult = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1280,
      height: 1066,
    });
    expect(validAspectResult.success).toBe(true);
  });

  it("rejects alt text exceeding 160 characters", () => {
    const longAlt = "a".repeat(161);
    const result = heroSlideItemInputSchema.safeParse({
      imageKey: validHeroKey,
      width: 1920,
      height: 1080,
      alt: longAlt,
    });
    expect(result.success).toBe(false);
  });
});

describe("createHeroSlidesBatchSchema", () => {
  const validSlide = {
    imageKey: validHeroKey,
    width: 1920,
    height: 1080,
  };

  it("accepts between 1 and 6 slides", () => {
    expect(createHeroSlidesBatchSchema.safeParse([validSlide]).success).toBe(
      true,
    );
    expect(
      createHeroSlidesBatchSchema.safeParse(new Array(6).fill(validSlide))
        .success,
    ).toBe(true);
  });

  it("rejects empty array", () => {
    expect(createHeroSlidesBatchSchema.safeParse([]).success).toBe(false);
  });

  it("rejects more than 6 slides", () => {
    expect(
      createHeroSlidesBatchSchema.safeParse(new Array(7).fill(validSlide))
        .success,
    ).toBe(false);
  });
});

describe("updateHeroSlideSchema", () => {
  it("accepts valid update with alt and focus", () => {
    const result = updateHeroSlideSchema.safeParse({
      id: validUuid,
      alt: "Updated description",
      focus: "left",
    });
    expect(result.success).toBe(true);
  });

  it("converts empty alt to null", () => {
    const result = updateHeroSlideSchema.safeParse({
      id: validUuid,
      alt: "",
      focus: "right",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.alt).toBeNull();
    }
  });

  it("rejects invalid UUID", () => {
    expect(
      updateHeroSlideSchema.safeParse({
        id: "not-a-uuid",
        focus: "center",
      }).success,
    ).toBe(false);
  });
});

describe("reorderHeroSlidesSchema", () => {
  const id1 = "11111111-1111-4111-8111-111111111111";
  const id2 = "22222222-2222-4222-8222-222222222222";

  it("accepts unique UUID list", () => {
    expect(reorderHeroSlidesSchema.safeParse({ ids: [id1, id2] }).success).toBe(
      true,
    );
  });

  it("rejects empty list", () => {
    expect(reorderHeroSlidesSchema.safeParse({ ids: [] }).success).toBe(false);
  });

  it("rejects duplicate IDs", () => {
    expect(reorderHeroSlidesSchema.safeParse({ ids: [id1, id1] }).success).toBe(
      false,
    );
  });
});

describe("heroSlideIdSchema", () => {
  it("accepts valid UUID and rejects non-UUID", () => {
    expect(heroSlideIdSchema.safeParse(validUuid).success).toBe(true);
    expect(heroSlideIdSchema.safeParse("1234").success).toBe(false);
  });
});
