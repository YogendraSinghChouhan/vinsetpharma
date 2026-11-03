import { describe, expect, it } from "bun:test";
import { formatDuration, formatFileSize, validateMediaFile } from "./utils";
import {
  createMediaBatchSchema,
  mediaItemInputSchema,
  reorderMediaSchema,
  updateMediaCaptionSchema,
} from "./validation";

const validImageKey = "media/11111111-2222-3333-4444-555555555555.jpg";
const validPosterKey = "media/22222222-3333-4444-5555-666666666666.png";
const validVideoKey = "media/33333333-4444-5555-6666-777777777777.mp4";

describe("mediaItemInputSchema validation", () => {
  it("accepts a valid photo item without poster or duration", () => {
    const validPhoto = {
      type: "image",
      fileKey: validImageKey,
      width: 1920,
      height: 1080,
      caption: "Laboratory cleanroom inspection",
    };

    const res = mediaItemInputSchema.safeParse(validPhoto);
    expect(res.success).toBe(true);
  });

  it("accepts a valid video item with poster and duration", () => {
    const validVideo = {
      type: "video",
      fileKey: validVideoKey,
      posterKey: validPosterKey,
      width: 1920,
      height: 1080,
      durationSeconds: 42,
      caption: "Liquid filling automated line",
    };

    const res = mediaItemInputSchema.safeParse(validVideo);
    expect(res.success).toBe(true);
  });

  it("transforms empty or whitespace-only caption into null", () => {
    const resEmpty = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validImageKey,
      width: 800,
      height: 600,
      caption: "",
    });
    expect(resEmpty.success).toBe(true);
    if (resEmpty.success) {
      expect(resEmpty.data.caption).toBeNull();
    }

    const resWhitespace = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validImageKey,
      width: 800,
      height: 600,
      caption: "    ",
    });
    expect(resWhitespace.success).toBe(true);
    if (resWhitespace.success) {
      expect(resWhitespace.data.caption).toBeNull();
    }
  });

  it("rejects captions exceeding 120 characters", () => {
    const tooLong = "A".repeat(121);
    const res = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validImageKey,
      width: 800,
      height: 600,
      caption: tooLong,
    });
    expect(res.success).toBe(false);
  });

  it("enforces cross-field rules for videos", () => {
    // Missing posterKey
    const missingPoster = mediaItemInputSchema.safeParse({
      type: "video",
      fileKey: validVideoKey,
      width: 1280,
      height: 720,
      durationSeconds: 30,
    });
    expect(missingPoster.success).toBe(false);

    // PosterKey pointing to a video
    const invalidPosterExt = mediaItemInputSchema.safeParse({
      type: "video",
      fileKey: validVideoKey,
      posterKey: "media/44444444-5555-6666-7777-888888888888.mp4",
      width: 1280,
      height: 720,
      durationSeconds: 30,
    });
    expect(invalidPosterExt.success).toBe(false);

    // Missing duration
    const missingDuration = mediaItemInputSchema.safeParse({
      type: "video",
      fileKey: validVideoKey,
      posterKey: validPosterKey,
      width: 1280,
      height: 720,
    });
    expect(missingDuration.success).toBe(false);

    // Zero or negative duration
    const zeroDuration = mediaItemInputSchema.safeParse({
      type: "video",
      fileKey: validVideoKey,
      posterKey: validPosterKey,
      width: 1280,
      height: 720,
      durationSeconds: 0,
    });
    expect(zeroDuration.success).toBe(false);

    // Video with image fileKey
    const videoWithImageKey = mediaItemInputSchema.safeParse({
      type: "video",
      fileKey: validImageKey,
      posterKey: validPosterKey,
      width: 1280,
      height: 720,
      durationSeconds: 15,
    });
    expect(videoWithImageKey.success).toBe(false);
  });

  it("enforces cross-field rules for images", () => {
    // Image having a posterKey
    const imageWithPoster = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validImageKey,
      posterKey: validPosterKey,
      width: 800,
      height: 600,
    });
    expect(imageWithPoster.success).toBe(false);

    // Image having duration
    const imageWithDuration = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validImageKey,
      width: 800,
      height: 600,
      durationSeconds: 10,
    });
    expect(imageWithDuration.success).toBe(false);

    // Image with video fileKey
    const imageWithVideoKey = mediaItemInputSchema.safeParse({
      type: "image",
      fileKey: validVideoKey,
      width: 800,
      height: 600,
    });
    expect(imageWithVideoKey.success).toBe(false);
  });

  it("rejects non-positive dimensions", () => {
    expect(
      mediaItemInputSchema.safeParse({
        type: "image",
        fileKey: validImageKey,
        width: 0,
        height: 600,
      }).success,
    ).toBe(false);

    expect(
      mediaItemInputSchema.safeParse({
        type: "image",
        fileKey: validImageKey,
        width: 800,
        height: -50,
      }).success,
    ).toBe(false);
  });
});

describe("createMediaBatchSchema", () => {
  const sampleItem = {
    type: "image" as const,
    fileKey: validImageKey,
    width: 1024,
    height: 768,
  };

  it("accepts a batch containing 1 to 20 items", () => {
    expect(createMediaBatchSchema.safeParse([sampleItem]).success).toBe(true);

    const twentyItems = Array.from({ length: 20 }, () => sampleItem);
    expect(createMediaBatchSchema.safeParse(twentyItems).success).toBe(true);
  });

  it("rejects an empty batch or a batch exceeding 20 items", () => {
    expect(createMediaBatchSchema.safeParse([]).success).toBe(false);

    const twentyOneItems = Array.from({ length: 21 }, () => sampleItem);
    expect(createMediaBatchSchema.safeParse(twentyOneItems).success).toBe(
      false,
    );
  });
});

describe("reorderMediaSchema", () => {
  const uuid1 = "11111111-1111-4111-8111-111111111111";
  const uuid2 = "22222222-2222-4222-8222-222222222222";
  const uuid3 = "33333333-3333-4333-8333-333333333333";

  it("accepts a non-empty array of unique UUIDs", () => {
    expect(
      reorderMediaSchema.safeParse({ ids: [uuid1, uuid2, uuid3] }).success,
    ).toBe(true);
  });

  it("rejects an empty array", () => {
    expect(reorderMediaSchema.safeParse({ ids: [] }).success).toBe(false);
  });

  it("rejects duplicate UUIDs in the array", () => {
    expect(
      reorderMediaSchema.safeParse({ ids: [uuid1, uuid2, uuid1] }).success,
    ).toBe(false);
  });

  it("rejects non-UUID strings", () => {
    expect(
      reorderMediaSchema.safeParse({ ids: ["invalid-id", uuid2] }).success,
    ).toBe(false);
  });
});

describe("updateMediaCaptionSchema", () => {
  const uuid1 = "11111111-1111-4111-8111-111111111111";

  it("accepts valid UUID with a string caption or null", () => {
    expect(
      updateMediaCaptionSchema.safeParse({
        id: uuid1,
        caption: "Sterile packaging",
      }).success,
    ).toBe(true);

    expect(
      updateMediaCaptionSchema.safeParse({
        id: uuid1,
        caption: null,
      }).success,
    ).toBe(true);
  });

  it("rejects malformed UUID", () => {
    expect(
      updateMediaCaptionSchema.safeParse({
        id: "not-a-uuid",
        caption: "Testing",
      }).success,
    ).toBe(false);
  });
});

describe("formatDuration helper", () => {
  it("formats seconds into mm:ss format", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(7)).toBe("0:07");
    expect(formatDuration(45)).toBe("0:45");
    expect(formatDuration(75)).toBe("1:15");
    expect(formatDuration(600)).toBe("10:00");
  });

  it("formats longer videos into hh:mm:ss format", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3665)).toBe("1:01:05");
  });

  it("falls back safely for null, undefined, negative or non-finite values", () => {
    expect(formatDuration(null)).toBe("0:00");
    expect(formatDuration(undefined)).toBe("0:00");
    expect(formatDuration(-15)).toBe("0:00");
    expect(formatDuration(Number.NaN)).toBe("0:00");
  });
});

describe("formatFileSize helper", () => {
  it("formats bytes into human readable units", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10.0 MB");
    expect(formatFileSize(100 * 1024 * 1024)).toBe("100.0 MB");
  });

  it("handles 0 or negative values", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(-100)).toBe("0 B");
  });
});

describe("validateMediaFile helper", () => {
  it("accepts supported image files within 10 MB", () => {
    const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 8 * 1024 * 1024 });

    const result = validateMediaFile(file);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.type).toBe("image");
    }
  });

  it("rejects image files exceeding 10 MB", () => {
    const file = new File(["dummy"], "huge.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 11 * 1024 * 1024 });

    const result = validateMediaFile(file);
    expect(result.valid).toBe(false);
  });

  it("accepts supported video files within 100 MB", () => {
    const file = new File(["dummy"], "clip.mp4", { type: "video/mp4" });
    Object.defineProperty(file, "size", { value: 65 * 1024 * 1024 });

    const result = validateMediaFile(file);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.type).toBe("video");
    }
  });

  it("rejects video files exceeding 100 MB", () => {
    const file = new File(["dummy"], "massive.mp4", { type: "video/mp4" });
    Object.defineProperty(file, "size", { value: 105 * 1024 * 1024 });

    const result = validateMediaFile(file);
    expect(result.valid).toBe(false);
  });

  it("rejects unsupported file types like pdf, gif, or svg", () => {
    const pdf = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    expect(validateMediaFile(pdf).valid).toBe(false);

    const gif = new File(["dummy"], "anim.gif", { type: "image/gif" });
    expect(validateMediaFile(gif).valid).toBe(false);
  });
});
