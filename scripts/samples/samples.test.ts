import { describe, expect, it } from "bun:test";
import { sanitizeContent } from "@/features/blogs/sanitize";
import { STORAGE_KEY_REGEX } from "@/features/storage/constants";
import {
  BLOG_POST_DISCLAIMER,
  SAMPLE_BLOG_POSTS,
  SAMPLE_PRODUCTS,
} from "./data";
import {
  BLOG_IMAGE_DIMENSIONS,
  buildPlaceholderSvg,
  generatePlaceholderPng,
  generateSolidPngFallback,
  generateStorageKey,
  PRODUCT_IMAGE_DIMENSIONS,
} from "./images";

describe("Sample Products Data", () => {
  it("contains exactly 10 sample products", () => {
    expect(SAMPLE_PRODUCTS.length).toBe(10);
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
    expect(isAllowedHost("https://vinsentpharma.com")).toBe(false);
    expect(isAllowedHost("https://staging.vinsentpharma.com")).toBe(false);
    expect(isAllowedHost("https://example.com")).toBe(false);
    expect(isAllowedHost("not-a-url")).toBe(false);
  });
});
