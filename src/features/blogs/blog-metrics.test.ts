import { describe, expect, it } from "bun:test";
import {
  calculateReadingTimeMinutes,
  calculateWordCount,
  createClientExcerpt,
  extractPlainTextFromHtml,
  formatReadingTime,
} from "./blog-metrics";

describe("blog-metrics", () => {
  describe("extractPlainTextFromHtml", () => {
    it("handles empty or null string", () => {
      expect(extractPlainTextFromHtml("")).toBe("");
    });

    it("strips basic HTML tags and decodes entities", () => {
      const html =
        "<p>Hello <strong>World</strong>&nbsp;&amp;&nbsp;everyone!</p>";
      expect(extractPlainTextFromHtml(html)).toBe("Hello World & everyone!");
    });

    it("preserves spaces between paragraphs and list items", () => {
      const html =
        "<h2>Heading</h2><p>First paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul>";
      expect(extractPlainTextFromHtml(html)).toBe(
        "Heading First paragraph. Item 1 Item 2",
      );
    });
  });

  describe("calculateWordCount", () => {
    it("returns 0 for empty string", () => {
      expect(calculateWordCount("")).toBe(0);
      expect(calculateWordCount("   ")).toBe(0);
    });

    it("counts words in plain text", () => {
      expect(calculateWordCount("Pharmaceutical quality assurance")).toBe(3);
    });

    it("counts words in HTML markup", () => {
      const html =
        "<p>Clinical research <em>advancements</em> in medicine.</p>";
      expect(calculateWordCount(html)).toBe(5);
    });
  });

  describe("calculateReadingTimeMinutes and formatReadingTime", () => {
    it("returns 0 min read for 0 words", () => {
      expect(calculateReadingTimeMinutes(0)).toBe(0);
      expect(formatReadingTime(0)).toBe("0 min read");
    });

    it("returns 1 min read for any positive count up to 200 words", () => {
      expect(calculateReadingTimeMinutes(1)).toBe(1);
      expect(calculateReadingTimeMinutes(150)).toBe(1);
      expect(calculateReadingTimeMinutes(200)).toBe(1);
      expect(formatReadingTime(1)).toBe("1 min read");
    });

    it("returns 2 min read for 201-400 words", () => {
      expect(calculateReadingTimeMinutes(201)).toBe(2);
      expect(calculateReadingTimeMinutes(400)).toBe(2);
      expect(formatReadingTime(2)).toBe("2 min read");
    });

    it("returns 3 min read for 500 words", () => {
      expect(calculateReadingTimeMinutes(500)).toBe(3);
      expect(formatReadingTime(3)).toBe("3 min read");
    });
  });

  describe("createClientExcerpt", () => {
    it("returns full text when shorter than maxLength", () => {
      expect(createClientExcerpt("Short summary.", 160)).toBe("Short summary.");
    });

    it("truncates at word boundary with ellipsis", () => {
      const text =
        "Vinset pharmaceuticals markets carefully presented pharmaceutical products to healthcare providers and institutions.";
      const excerpt = createClientExcerpt(text, 60);
      expect(excerpt.length).toBeLessThanOrEqual(63); // 60 + '...'
      expect(excerpt.endsWith("...")).toBe(true);
      expect(excerpt).not.toContain("protocolsensuring");
    });

    it("extracts from HTML input before truncating", () => {
      const html =
        "<p><strong>Breaking:</strong> New healthcare guidance released for community clinics.</p>";
      const excerpt = createClientExcerpt(html, 40);
      expect(excerpt.startsWith("Breaking: New healthcare")).toBe(true);
      expect(excerpt.endsWith("...")).toBe(true);
    });
  });
});
