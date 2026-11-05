import { describe, expect, it } from "bun:test";
import { CONTACT, legalName, SITE_DESCRIPTION } from "@/config/site";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/features/legal/content";
import {
  ABOUT,
  CTA,
  FOOTER_COPY,
  FOUNDER,
  HERO,
  HOME_COPY,
  PAGE_META,
  PRODUCT_NOTICE,
  WHY_US,
} from "./content";

function extractStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(extractStrings);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap(extractStrings);
  }
  return [];
}

const forbiddenPatterns = [
  /\bwe manufacture\b/i,
  /\bour manufacturing\b(?! partners)/i,
  /\bour (plant|factory|facilit|laborator)/i,
  /\bGMP\b/,
  /\bWHO\b/,
  /\bISO\b/,
  /certified/i,
  /\b(best|leading|world-class|trusted by|pan-India|nationwide|worldwide|guarantee[sd]?)\b/i,
  /\b\d+\+?\s*years\b/i,
];

describe("public content claims", () => {
  it("contains no forbidden claims", () => {
    const content = [
      ABOUT,
      CTA,
      FOOTER_COPY,
      FOUNDER,
      HERO,
      HOME_COPY,
      PAGE_META,
      PRODUCT_NOTICE,
      WHY_US,
      PRIVACY_POLICY,
      TERMS_AND_CONDITIONS,
      { legalName, SITE_DESCRIPTION, CONTACT },
    ];

    for (const string of extractStrings(content)) {
      for (const pattern of forbiddenPatterns) {
        expect(string).not.toMatch(pattern);
      }
    }
  });
});
