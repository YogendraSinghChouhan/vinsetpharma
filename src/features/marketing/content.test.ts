import { describe, expect, it } from "bun:test";
import { ABOUT, FOUNDER, PAGE_META, WHY_US } from "./content";

// Standard forbidden words to check
const FORBIDDEN_WORDS_CASE_INSENSITIVE = [
  "certified",
  "certification",
  "factory",
  "plant",
  "laboratory",
  "leading",
  "best",
  "trusted",
  "years",
];

const FORBIDDEN_ACRONYMS = ["GMP", "WHO", "ISO"];

function extractStrings(obj: unknown): string[] {
  const strings: string[] = [];
  if (typeof obj === "string") {
    strings.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      strings.push(...extractStrings(item));
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const val of Object.values(obj)) {
      strings.push(...extractStrings(val));
    }
  }
  return strings;
}

function countWords(strings: string[]): number {
  return strings
    .join(" ")
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

describe("Marketing Content Compliance", () => {
  it("PAGE_META descriptions stay under 160 characters", () => {
    expect(PAGE_META.about.description.length).toBeLessThanOrEqual(160);
    expect(PAGE_META.whyUs.description.length).toBeLessThanOrEqual(160);
  });

  it("ABOUT content contains no pharma forbidden words or regulatory acronyms", () => {
    const allAboutStrings = extractStrings(ABOUT);
    const textCorpus = allAboutStrings.join(" ");

    for (const word of FORBIDDEN_WORDS_CASE_INSENSITIVE) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }

    for (const acronym of FORBIDDEN_ACRONYMS) {
      const regex = new RegExp(`\\b${acronym}\\b`);
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }
  });

  it("FOUNDER content contains no pharma forbidden words or regulatory acronyms", () => {
    const allFounderStrings = extractStrings(FOUNDER);
    const textCorpus = allFounderStrings.join(" ");

    const FORBIDDEN_WORDS = [
      ...FORBIDDEN_WORDS_CASE_INSENSITIVE,
      "visionary",
      "expert",
      "leader",
      "pioneer",
      "renowned",
      "award",
      "passion",
      "experience",
    ];

    for (const word of FORBIDDEN_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }

    for (const acronym of FORBIDDEN_ACRONYMS) {
      const regex = new RegExp(`\\b${acronym}\\b`);
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }
  });

  it("WHY_US content contains no pharma forbidden words or regulatory acronyms", () => {
    const allWhyUsStrings = extractStrings(WHY_US);
    const textCorpus = allWhyUsStrings.join(" ");

    for (const word of FORBIDDEN_WORDS_CASE_INSENSITIVE) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }

    for (const acronym of FORBIDDEN_ACRONYMS) {
      const regex = new RegExp(`\\b${acronym}\\b`);
      const match = regex.exec(textCorpus);
      expect(match).toBeNull();
    }
  });

  it("ABOUT content total word count is within target range (600 to 900 words)", () => {
    const aboutStrings = extractStrings(ABOUT);
    const wordCount = countWords(aboutStrings);
    console.log(`About Us content total word count: ${wordCount}`);
    expect(wordCount).toBeGreaterThanOrEqual(600);
    expect(wordCount).toBeLessThanOrEqual(900);
  });

  it("WHY_US content total word count is within target range (700 to 900 words)", () => {
    const whyUsStrings = extractStrings(WHY_US);
    const wordCount = countWords(whyUsStrings);
    console.log(`Why Us content total word count: ${wordCount}`);
    expect(wordCount).toBeGreaterThanOrEqual(700);
    expect(wordCount).toBeLessThanOrEqual(900);
  });
});
