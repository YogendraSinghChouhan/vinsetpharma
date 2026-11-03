/**
 * Pure client-safe utilities for blog post calculations.
 * Does NOT import server-only modules or sanitize-html.
 */

/**
 * Extracts clean plain text from an HTML string using lightweight string operations.
 * Safe for client-side execution in browsers and tests.
 */
export function extractPlainTextFromHtml(html: string): string {
  if (!html) return "";

  // Replace block element tags with space so words don't concatenate
  const withSpaces = html
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    // Strip all HTML tags
    .replace(/<[^>]*>/g, " ");

  // Decode common HTML entities
  const decoded = withSpaces
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Collapse consecutive whitespaces and trim
  return decoded.replace(/\s+/g, " ").trim();
}

/**
 * Counts the number of words in a plain text string.
 * Splits on whitespace boundaries.
 */
export function calculateWordCount(textOrHtml: string): number {
  if (!textOrHtml) return 0;
  const plainText = textOrHtml.includes("<")
    ? extractPlainTextFromHtml(textOrHtml)
    : textOrHtml.trim();

  if (!plainText) return 0;
  const words = plainText.split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Calculates estimated reading time in minutes at 200 words per minute.
 * If wordCount > 0, returns at least 1 minute.
 */
export function calculateReadingTimeMinutes(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Formats reading time for display.
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) return "0 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

/**
 * Generates a clean client-side plain-text excerpt on word boundaries.
 */
export function createClientExcerpt(
  textOrHtml: string,
  maxLength = 160,
): string {
  if (!textOrHtml) return "";
  const plainText = textOrHtml.includes("<")
    ? extractPlainTextFromHtml(textOrHtml)
    : textOrHtml.trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace).replace(/[.,;:!?]+$/, "")}...`;
  }

  return `${truncated}...`;
}
