import { describe, expect, it } from "bun:test";
import { getPlainTextExcerpt, sanitizeContent } from "./sanitize";

describe("sanitizeContent", () => {
  it("removes <script> tags and their contents", () => {
    const input = '<p>Safe text</p><script>alert("xss")</script>';
    const output = sanitizeContent(input);
    expect(output).not.toContain("script");
    expect(output).not.toContain("alert");
    expect(output).toContain("<p>Safe text</p>");
  });

  it("removes onerror and other inline event handlers", () => {
    const input =
      '<p onerror="alert(1)">Text</p><a href="https://example.com" onclick="steal()">Link</a>';
    const output = sanitizeContent(input);
    expect(output).not.toContain("onerror");
    expect(output).not.toContain("onclick");
    expect(output).not.toContain("steal");
  });

  it("removes javascript: scheme links", () => {
    const input = '<a href="javascript:alert(1)">Click me</a>';
    const output = sanitizeContent(input);
    expect(output).not.toContain("javascript:");
    expect(output).not.toContain("alert");
  });

  it("removes <iframe> tags and their contents", () => {
    const input =
      '<p>Intro</p><iframe src="https://evil.com">Evil frame</iframe>';
    const output = sanitizeContent(input);
    expect(output).not.toContain("iframe");
    expect(output).not.toContain("evil.com");
  });

  it("removes style tags and style attributes", () => {
    const input =
      '<style>body { color: red; }</style><p style="color: red; font-size: 50px;">Styled text</p>';
    const output = sanitizeContent(input);
    expect(output).not.toContain("<style>");
    expect(output).not.toContain("style=");
    expect(output).toContain("<p>Styled text</p>");
  });

  it("preserves allowed tags and structure", () => {
    const input =
      "<h2>Heading 2</h2><h3>Heading 3</h3><p>Paragraph with <strong>strong</strong> and <em>emphasis</em>.</p><blockquote>Quote</blockquote><ul><li>Item 1</li><li>Item 2</li></ul><ol><li>Ordered</li></ol><br />";
    const output = sanitizeContent(input);
    expect(output).toContain("<h2>Heading 2</h2>");
    expect(output).toContain("<h3>Heading 3</h3>");
    expect(output).toContain("<strong>strong</strong>");
    expect(output).toContain("<em>emphasis</em>");
    expect(output).toContain("<blockquote>Quote</blockquote>");
    expect(output).toContain("<ul><li>Item 1</li><li>Item 2</li></ul>");
    expect(output).toContain("<ol><li>Ordered</li></ol>");
  });

  it("forces rel='noopener noreferrer' and target='_blank' on external links", () => {
    const input =
      '<a href="https://medical-journal.org/paper">External Paper</a>';
    const output = sanitizeContent(input);
    expect(output).toContain('target="_blank"');
    expect(output).toContain('rel="noopener noreferrer"');
    expect(output).toContain('href="https://medical-journal.org/paper"');
  });

  it("preserves mailto links without target blank", () => {
    const input = '<a href="mailto:info@vinsetpharma.com">Email Us</a>';
    const output = sanitizeContent(input);
    expect(output).toContain('href="mailto:info@vinsetpharma.com"');
    expect(output).not.toContain('target="_blank"');
  });
});

describe("getPlainTextExcerpt", () => {
  it("strips all HTML tags and collapses whitespace", () => {
    const html =
      "<h2>Title</h2><p>First paragraph with <strong>bold</strong> text.</p><p>Second paragraph.</p>";
    const excerpt = getPlainTextExcerpt(html);
    expect(excerpt).toBe(
      "Title First paragraph with bold text. Second paragraph.",
    );
  });

  it("decodes HTML entities properly", () => {
    const html =
      "<p>Research &amp; Development &mdash; 500 &lt; 1000 &quot;quoted&quot;</p>";
    const excerpt = getPlainTextExcerpt(html);
    expect(excerpt).toContain("Research & Development");
    expect(excerpt).toContain('"quoted"');
  });

  it("truncates on word boundaries without breaking words and appends ellipsis", () => {
    const text =
      "<p>The quick brown fox jumps over the lazy dog repeatedly until the sentence becomes very long.</p>";
    const excerpt = getPlainTextExcerpt(text, 30);
    expect(excerpt.length).toBeLessThanOrEqual(35); // 30 + "..."
    expect(excerpt.endsWith("...")).toBe(true);
    // Should not cut "brown" or "jumps" in half
    expect(excerpt).toBe("The quick brown fox jumps...");
  });

  it("returns full text when within maxLength", () => {
    const text = "<p>Short description.</p>";
    expect(getPlainTextExcerpt(text, 100)).toBe("Short description.");
  });

  it("returns empty string when input is empty", () => {
    expect(getPlainTextExcerpt("")).toBe("");
  });
});
