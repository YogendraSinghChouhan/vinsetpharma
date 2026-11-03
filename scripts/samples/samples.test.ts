import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { sanitizeContent } from "@/features/blogs/sanitize";
import {
  isValidHeroKey,
  isValidMediaKey,
  STORAGE_KEY_REGEX,
} from "@/features/storage/constants";
import {
  BLOG_POST_DISCLAIMER,
  FEATURED_SAMPLE_PRODUCT_SLUGS,
  LEGACY_SAMPLE_CATEGORY_SLUGS,
  PRODUCT_TO_CATEGORY_SLUG,
  SAMPLE_BLOG_POSTS,
  SAMPLE_CATEGORIES,
  SAMPLE_PRODUCTS,
} from "./data";
import {
  ALL_SAMPLE_HERO_KEYS,
  getSampleHeroStorageKey,
  SAMPLE_HERO_LIMIT,
} from "./hero-data";
import {
  BLOG_IMAGE_DIMENSIONS,
  buildPlaceholderSvg,
  generatePlaceholderPng,
  generateSolidPngFallback,
  generateStorageKey,
  PRODUCT_IMAGE_DIMENSIONS,
} from "./images";
import {
  ALL_SAMPLE_MEDIA_KEYS,
  getSampleMediaStorageKey,
  SAMPLE_MEDIA_ENTRIES,
  SAMPLE_MEDIA_ITEMS,
} from "./media-data";

describe("Sample Categories Data", () => {
  it("contains exactly 5 sample categories with specified slugs in order", () => {
    expect(SAMPLE_CATEGORIES.length).toBe(5);
    const expectedSlugs = [
      "tablets-and-capsules",
      "syrups-and-suspensions",
      "creams-gels-and-ointments",
      "injectables",
      "sachets",
    ];
    expect(SAMPLE_CATEGORIES.map((c) => c.slug)).toEqual(expectedSlugs);
  });

  it("exports legacy sample category slugs for backwards-compatible migration", () => {
    expect(LEGACY_SAMPLE_CATEGORY_SLUGS).toEqual(["tablets", "capsules"]);
  });

  it("has unique slugs and non-empty name for every category", () => {
    const slugs = new Set<string>();
    for (const category of SAMPLE_CATEGORIES) {
      expect(category.name.trim().length).toBeGreaterThan(0);
      expect(category.slug.trim().length).toBeGreaterThan(0);
      expect(slugs.has(category.slug)).toBe(false);
      slugs.add(category.slug);
    }
    expect(slugs.size).toBe(5);
  });

  it("maps every sample product to an existing sample category", () => {
    const categorySlugs = new Set(SAMPLE_CATEGORIES.map((c) => c.slug));

    for (const product of SAMPLE_PRODUCTS) {
      const mappedCategorySlug = PRODUCT_TO_CATEGORY_SLUG[product.slug];
      expect(mappedCategorySlug).toBeDefined();
      expect(categorySlugs.has(mappedCategorySlug)).toBe(true);
    }

    // Verify exact product-category mappings from specification
    expect(PRODUCT_TO_CATEGORY_SLUG["veltra-d-tablets"]).toBe(
      "tablets-and-capsules",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["nexivin-capsules"]).toBe(
      "tablets-and-capsules",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["lumivin-softgel-capsules"]).toBe(
      "tablets-and-capsules",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["orvita-syrup"]).toBe(
      "syrups-and-suspensions",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["zenvira-dry-syrup"]).toBe(
      "syrups-and-suspensions",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["dermavin-cream"]).toBe(
      "creams-gels-and-ointments",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["flexavin-gel"]).toBe(
      "creams-gels-and-ointments",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["woundvin-ointment"]).toBe(
      "creams-gels-and-ointments",
    );
    expect(PRODUCT_TO_CATEGORY_SLUG["clarivin-injection"]).toBe("injectables");
    expect(PRODUCT_TO_CATEGORY_SLUG["hydravin-sachets"]).toBe("sachets");
  });

  it("verifies sample data file consistency across categories and products", () => {
    const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    // 1. Exactly five categories
    expect(SAMPLE_CATEGORIES.length).toBe(5);

    // 2. All category slugs are unique and valid
    const categorySlugs = new Set<string>();
    for (const category of SAMPLE_CATEGORIES) {
      expect(category.slug).toMatch(SLUG_REGEX);
      expect(categorySlugs.has(category.slug)).toBe(false);
      categorySlugs.add(category.slug);
    }
    expect(categorySlugs.size).toBe(5);

    // 3. All product slugs are unique and valid
    const productSlugs = new Set<string>();
    for (const product of SAMPLE_PRODUCTS) {
      expect(product.slug).toMatch(SLUG_REGEX);
      expect(productSlugs.has(product.slug)).toBe(false);
      productSlugs.add(product.slug);
    }
    expect(productSlugs.size).toBe(10);

    // 4. Every sample product slug appears in exactly one category
    const mappedProductSlugs = Object.keys(PRODUCT_TO_CATEGORY_SLUG);
    expect(mappedProductSlugs.length).toBe(SAMPLE_PRODUCTS.length);

    for (const product of SAMPLE_PRODUCTS) {
      const targetCategorySlug = PRODUCT_TO_CATEGORY_SLUG[product.slug];
      expect(targetCategorySlug).toBeDefined();
      expect(typeof targetCategorySlug).toBe("string");
      expect(categorySlugs.has(targetCategorySlug)).toBe(true);
    }

    // 5. Every mapped product slug exists in the sample products
    for (const mappedSlug of mappedProductSlugs) {
      expect(productSlugs.has(mappedSlug)).toBe(true);
    }
  });
});

describe("Sample Products Data", () => {
  it("contains exactly 10 sample products", () => {
    expect(SAMPLE_PRODUCTS.length).toBe(10);
  });

  it("exports exactly 6 featured sample products conforming to specification", () => {
    expect(FEATURED_SAMPLE_PRODUCT_SLUGS.length).toBe(6);
    const expectedFeatured = [
      "veltra-d-tablets",
      "nexivin-capsules",
      "orvita-syrup",
      "dermavin-cream",
      "clarivin-injection",
      "hydravin-sachets",
    ];
    expect(Array.from(FEATURED_SAMPLE_PRODUCT_SLUGS)).toEqual(expectedFeatured);

    const productSlugs = new Set(SAMPLE_PRODUCTS.map((p) => p.slug));
    for (const featuredSlug of FEATURED_SAMPLE_PRODUCT_SLUGS) {
      expect(productSlugs.has(featuredSlug)).toBe(true);
    }
  });

  it("has unique slugs and non-empty required fields for every product", () => {
    const slugs = new Set<string>();

    for (const product of SAMPLE_PRODUCTS) {
      expect(product.title.trim().length).toBeGreaterThan(0);
      expect(product.slug.trim().length).toBeGreaterThan(0);
      expect(product.tagline.trim().length).toBeGreaterThan(0);
      expect(product.description.trim().length).toBeGreaterThan(0);
      expect(product.imageUrl.startsWith("https://")).toBe(true);

      // Verify no duplicate slugs
      expect(slugs.has(product.slug)).toBe(false);
      slugs.add(product.slug);
    }

    expect(slugs.size).toBe(10);
  });
});

describe("Sample Blog Posts Data", () => {
  it("contains exactly 10 sample blog posts", () => {
    expect(SAMPLE_BLOG_POSTS.length).toBe(10);
  });

  it("has unique slugs, non-empty fields, and null seoTitle for all posts", () => {
    const slugs = new Set<string>();

    for (const post of SAMPLE_BLOG_POSTS) {
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.slug.trim().length).toBeGreaterThan(0);
      expect(post.seoDescription.trim().length).toBeGreaterThan(0);
      expect(post.seoTitle).toBeNull();
      expect(post.content.trim().length).toBeGreaterThan(0);
      expect(post.imageUrl.startsWith("https://")).toBe(true);

      // Verify no duplicate slugs
      expect(slugs.has(post.slug)).toBe(false);
      slugs.add(post.slug);
    }

    expect(slugs.size).toBe(10);
  });

  it("sanitizes post content and disclaimer cleanly without losing allowed markup", () => {
    const combined = `${SAMPLE_BLOG_POSTS[0]?.content}${BLOG_POST_DISCLAIMER}`;
    const sanitized = sanitizeContent(combined);

    expect(sanitized).toContain("<p>");
    expect(sanitized).toContain("<h2>");
    expect(sanitized).toContain("<ul>");
    expect(sanitized).toContain("<li>");
    expect(sanitized).toContain("<strong>");
    expect(sanitized).toContain("<em>");
    expect(sanitized).toContain("This article is general information");
  });
});

describe("Sample Image Utilities", () => {
  it("exports correct image dimensions for products and blogs", () => {
    expect(PRODUCT_IMAGE_DIMENSIONS.width).toBe(1200);
    expect(PRODUCT_IMAGE_DIMENSIONS.height).toBe(900);
    expect(BLOG_IMAGE_DIMENSIONS.width).toBe(1600);
    expect(BLOG_IMAGE_DIMENSIONS.height).toBe(900);
  });

  it("generates valid storage keys matching the app regex", () => {
    const productKey = generateStorageKey("products");
    expect(STORAGE_KEY_REGEX.test(productKey)).toBe(true);
    expect(productKey.startsWith("products/")).toBe(true);
    expect(productKey.endsWith(".png")).toBe(true);

    const blogKey = generateStorageKey("blogs");
    expect(STORAGE_KEY_REGEX.test(blogKey)).toBe(true);
    expect(blogKey.startsWith("blogs/")).toBe(true);
    expect(blogKey.endsWith(".png")).toBe(true);

    const categoryKey = generateStorageKey("categories");
    expect(STORAGE_KEY_REGEX.test(categoryKey)).toBe(true);
    expect(categoryKey.startsWith("categories/")).toBe(true);
    expect(categoryKey.endsWith(".png")).toBe(true);
  });

  it("builds valid placeholder SVG containing item initial", () => {
    const svg = buildPlaceholderSvg({
      width: PRODUCT_IMAGE_DIMENSIONS.width,
      height: PRODUCT_IMAGE_DIMENSIONS.height,
      title: "Veltra-D Tablets",
      shapeType: "pill",
    });

    expect(svg).toContain('<svg width="1200" height="900"');
    expect(svg).toMatch(/>\s*V\s*</);
    expect(svg).toContain("rx=");
  });

  it("generates valid PNG buffer via fallback generator", () => {
    const png = generateSolidPngFallback(50, 50);
    expect(Buffer.isBuffer(png)).toBe(true);
    // Verify PNG magic numbers: 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    expect(png[0]).toBe(0x89);
    expect(png[1]).toBe(0x50);
    expect(png[2]).toBe(0x4e);
    expect(png[3]).toBe(0x47);
  });

  it("generates valid PNG placeholder for products and blog posts", async () => {
    const productPng = await generatePlaceholderPng({
      width: 120, // test with smaller dimensions for fast unit test
      height: 90,
      title: "Veltra-D Tablets",
      shapeType: "pill",
    });

    expect(Buffer.isBuffer(productPng)).toBe(true);
    expect(productPng[0]).toBe(0x89);
    expect(productPng[1]).toBe(0x50);
    expect(productPng[2]).toBe(0x4e);
    expect(productPng[3]).toBe(0x47);

    const blogPng = await generatePlaceholderPng({
      width: 160,
      height: 90,
      title: "How to Read a Medicine Label",
      shapeType: "leaf",
    });

    expect(Buffer.isBuffer(blogPng)).toBe(true);
    expect(blogPng[0]).toBe(0x89);
    expect(blogPng[1]).toBe(0x50);
    expect(blogPng[2]).toBe(0x4e);
    expect(blogPng[3]).toBe(0x47);
  });
});

describe("Local Environment Host Guard Logic", () => {
  function isAllowedHost(urlStr: string): boolean {
    try {
      const hostname = new URL(urlStr).hostname;
      return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
      return false;
    }
  }

  it("permits localhost and 127.0.0.1", () => {
    expect(isAllowedHost("http://localhost:3000")).toBe(true);
    expect(isAllowedHost("http://127.0.0.1:3000")).toBe(true);
    expect(isAllowedHost("https://localhost")).toBe(true);
  });

  it("rejects non-local domains to protect production", () => {
    expect(isAllowedHost("https://vinsetpharma.com")).toBe(false);
    expect(isAllowedHost("https://staging.vinsetpharma.com")).toBe(false);
    expect(isAllowedHost("https://example.com")).toBe(false);
    expect(isAllowedHost("not-a-url")).toBe(false);
  });
});

describe("Sample Media Showcase Data & Files", () => {
  it("contains exactly 20 sample media items with valid extensions", () => {
    expect(SAMPLE_MEDIA_ENTRIES.length).toBe(20);
    expect(SAMPLE_MEDIA_ITEMS.length).toBe(20);

    for (const item of SAMPLE_MEDIA_ITEMS) {
      expect(item.file).toMatch(/\.(jpg|jpeg|png|webp)$/i);
    }
  });

  it("contains exactly 6 null captions and all non-null captions are <= 8 words", () => {
    const nullCaptions = SAMPLE_MEDIA_ITEMS.filter(
      (item) => item.caption === null,
    );
    expect(nullCaptions.length).toBe(6);

    const nonNullCaptions = SAMPLE_MEDIA_ITEMS.filter(
      (item) => item.caption !== null,
    );
    expect(nonNullCaptions.length).toBe(14);

    for (const item of nonNullCaptions) {
      const caption = item.caption as string;
      expect(caption.trim().length).toBeGreaterThan(0);
      const wordCount = caption.trim().split(/\s+/).length;
      expect(wordCount).toBeLessThanOrEqual(8);
    }
  });

  it("generates deterministic, unique, and valid media storage keys", () => {
    expect(ALL_SAMPLE_MEDIA_KEYS.length).toBe(20);
    const uniqueKeys = new Set(ALL_SAMPLE_MEDIA_KEYS);
    expect(uniqueKeys.size).toBe(20);

    for (const item of SAMPLE_MEDIA_ITEMS) {
      // Must match media storage key regex (media/<uuid>.<ext>)
      expect(isValidMediaKey(item.key)).toBe(true);

      // Must be deterministic: re-generating yields the exact same key
      const ext = item.file.split(".").pop()?.toLowerCase() || "jpg";
      const regeneratedKey = getSampleMediaStorageKey(item.index, ext);
      expect(regeneratedKey).toBe(item.key);
    }
  });

  it("verifies all 20 sample photo files on disk match orientation, dimension, and size specifications", async () => {
    const mediaDir = path.join(process.cwd(), "scripts", "samples", "media");
    expect(fs.existsSync(mediaDir)).toBe(true);

    let landscapeCount = 0;
    let portraitCount = 0;
    let squareCount = 0;

    for (const item of SAMPLE_MEDIA_ITEMS) {
      const filePath = path.join(mediaDir, item.file);
      expect(fs.existsSync(filePath)).toBe(true);

      const stats = fs.statSync(filePath);
      // File size must be <= 600 KB (614,400 bytes)
      expect(stats.size).toBeLessThanOrEqual(600 * 1024);

      const buffer = fs.readFileSync(filePath);
      const meta = await sharp(buffer).metadata();

      expect(meta.width).toBeDefined();
      expect(meta.height).toBeDefined();
      expect(["jpeg", "png", "webp"]).toContain(meta.format ?? "");

      const width = meta.width ?? 0;
      const height = meta.height ?? 0;

      // Max dimension <= 2000px
      expect(width).toBeLessThanOrEqual(2000);
      expect(height).toBeLessThanOrEqual(2000);

      if (width > height) {
        landscapeCount++;
      } else if (width < height) {
        portraitCount++;
      } else {
        squareCount++;
      }
    }

    // Specification: 12 landscape, 4 portrait, 4 square
    expect(landscapeCount).toBe(12);
    expect(portraitCount).toBe(4);
    expect(squareCount).toBe(4);
  });
});

describe("Sample Hero Data & Key Derivation", () => {
  it("derives deterministic, unique, and valid hero storage keys", () => {
    expect(ALL_SAMPLE_HERO_KEYS.length).toBe(SAMPLE_HERO_LIMIT);
    const uniqueKeys = new Set(ALL_SAMPLE_HERO_KEYS);
    expect(uniqueKeys.size).toBe(SAMPLE_HERO_LIMIT);

    for (let i = 1; i <= SAMPLE_HERO_LIMIT; i++) {
      const key = getSampleHeroStorageKey(i, "jpg");
      expect(isValidHeroKey(key)).toBe(true);
      expect(key.startsWith("hero/")).toBe(true);
      expect(key.endsWith(".jpg")).toBe(true);

      // Verify idempotency: calling with same index and ext yields identical key
      expect(getSampleHeroStorageKey(i, "jpg")).toBe(key);
    }
  });

  it("verifies suitable landscape sample images exist on disk (width >= 1600, aspect >= 1.4)", async () => {
    const mediaDir = path.join(process.cwd(), "scripts", "samples", "media");
    expect(fs.existsSync(mediaDir)).toBe(true);

    const files = fs.readdirSync(mediaDir);
    let suitableCount = 0;

    for (const file of files) {
      const filePath = path.join(mediaDir, file);
      if (!fs.statSync(filePath).isFile()) continue;

      const buffer = fs.readFileSync(filePath);
      const meta = await sharp(buffer).metadata();
      const width = meta.width ?? 0;
      const height = meta.height ?? 0;
      const aspect = height > 0 ? width / height : 0;

      if (width >= 1600 && aspect >= 1.4) {
        suitableCount++;
      }
    }

    // We need at least 4 suitable landscape images for the hero seed
    expect(suitableCount).toBeGreaterThanOrEqual(4);
  });
});
