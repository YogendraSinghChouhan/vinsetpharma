import "server-only";

import sanitizeHtml from "sanitize-html";
import { BLOG_ALLOWED_SCHEMES, BLOG_ALLOWED_TAGS } from "./constants";

/**
 * Sanitizes HTML content from the rich-text editor using strict allowlists.
 * - Allowed tags: p, br, h2, h3, strong, em, ul, ol, li, blockquote, a
 * - Allowed schemes for links: http, https, mailto
 * - Forces rel="noopener noreferrer" and target="_blank" on external links
 * - Strips all other attributes, styles, classes, scripts, iframes, images
 */
export function sanitizeContent(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: [...BLOG_ALLOWED_TAGS],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: [...BLOG_ALLOWED_SCHEMES],
    transformTags: {
      a: (_tagName, attribs) => {
        const href = attribs.href ? attribs.href.trim() : "";
        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");

        const newAttribs: Record<string, string> = { href };
        if (isExternal) {
          newAttribs.target = "_blank";
          newAttribs.rel = "noopener noreferrer";
        }

        return {
          tagName: "a",
          attribs: newAttribs,
        };
      },
    },
    nonTextTags: [
      "style",
      "script",
      "textarea",
      "option",
      "noscript",
      "iframe",
    ],
  });
}

/**
 * Generates a clean plain-text excerpt for cards and metadata:
 * - Strips all HTML tags
 * - Decodes HTML entities
 * - Collapses whitespace
 * - Truncates to ~160 chars on word boundaries without breaking words
 * - Appends an ellipsis when truncated
 */
export function getPlainTextExcerpt(html: string, maxLength = 160): string {
  if (!html) return "";

  // Replace block element endings with space so text blocks do not merge together
  const withSpaces = html
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ");

  const stripped = sanitizeHtml(withSpaces, {
    allowedTags: [],
    allowedAttributes: {},
    nonTextTags: [
      "style",
      "script",
      "textarea",
      "option",
      "noscript",
      "iframe",
    ],
  });

  const decoded = stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&amp;/g, "&");

  const normalized = decoded.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace).replace(/[.,;:!?]+$/, "")}...`;
  }

  return `${truncated}...`;
}
