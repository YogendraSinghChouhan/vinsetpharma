import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import sharp from "sharp";
import { AboutHero } from "./components/about-hero";
import { FOUNDER } from "./content";
import { ABOUT_IMAGES, HOME_IMAGES, WHY_US_IMAGES } from "./images";

const FORBIDDEN_WORDS = [
  "certified",
  "gmp",
  "who",
  "iso",
  "manufacturer",
  "factory",
  "plant",
  "laboratory",
  "leading",
  "best",
  "trusted",
  "years",
];

describe("Marketing Images Configuration", () => {
  const allSlots = [
    { slotName: "Home hero", slot: HOME_IMAGES.hero },
    { slotName: "About hero", slot: ABOUT_IMAGES.hero },
    { slotName: "About values", slot: ABOUT_IMAGES.values },
    { slotName: "About process", slot: ABOUT_IMAGES.process },
    { slotName: "Why Us hero", slot: WHY_US_IMAGES.hero },
    { slotName: "Why Us principles", slot: WHY_US_IMAGES.principles },
  ];

  it("has 6 configured image slots", () => {
    expect(allSlots).toHaveLength(6);
  });

  for (const { slotName, slot } of allSlots) {
    it(`${slotName} points to an existing file on disk when set`, () => {
      if (slot) {
        expect(slot.src.startsWith("/images/")).toBe(true);
        const diskPath = path.join(process.cwd(), "public", slot.src);
        expect(fs.existsSync(diskPath)).toBe(true);
        expect(fs.statSync(diskPath).size).toBeGreaterThan(0);
        expect(fs.statSync(diskPath).size).toBeLessThan(500 * 1024);
      }
    });

    it(`${slotName} has valid dimension attributes and compliant alt text`, () => {
      if (slot) {
        expect(slot.width).toBeGreaterThan(0);
        expect(slot.width).toBeLessThanOrEqual(2000);
        expect(slot.height).toBeGreaterThan(0);
        expect(slot.alt.length).toBeGreaterThan(10);

        // Verify alt text contains none of the pharma forbidden words
        const lowerAlt = slot.alt.toLowerCase();
        for (const forbidden of FORBIDDEN_WORDS) {
          const regex = new RegExp(`\\b${forbidden}\\b`, "i");
          expect(regex.test(lowerAlt)).toBe(false);
        }
      }
    });
  }

  describe("Leadership Portrait Configuration", () => {
    it("FOUNDER.image points to an existing file on disk matching configured dimensions", async () => {
      expect(FOUNDER.image.src.startsWith("/images/")).toBe(true);
      const diskPath = path.join(process.cwd(), "public", FOUNDER.image.src);
      expect(fs.existsSync(diskPath)).toBe(true);
      expect(fs.statSync(diskPath).size).toBeGreaterThan(0);
      expect(fs.statSync(diskPath).size).toBeLessThan(500 * 1024);

      // Verify dimensions on disk match configured dimensions exactly
      const meta = await sharp(diskPath).metadata();
      expect(meta.width).toBe(FOUNDER.image.width);
      expect(meta.height).toBe(FOUNDER.image.height);
    });

    it("FOUNDER.image has compliant alt text without forbidden words", () => {
      expect(FOUNDER.image.alt.length).toBeGreaterThan(10);
      const lowerAlt = FOUNDER.image.alt.toLowerCase();
      for (const forbidden of FORBIDDEN_WORDS) {
        const regex = new RegExp(`\\b${forbidden}\\b`, "i");
        expect(regex.test(lowerAlt)).toBe(false);
      }
    });
  });

  describe("Leadership Content & AboutHero Component Rendering", () => {
    it("FOUNDER.message and FOUNDER.bio are null by default", () => {
      expect(FOUNDER.message).toBeNull();
      expect(FOUNDER.bio).toBeNull();
    });

    it("AboutHero does not render blockquote or bio blocks when message and bio are null", () => {
      const html = renderToString(React.createElement(AboutHero));

      // No blockquote is rendered
      expect(html.includes("<blockquote")).toBe(false);

      // The portrait caption identifies the person shown, separately from the founder.
      expect(html.includes(FOUNDER.image.personName)).toBe(true);
      expect(html.includes(FOUNDER.image.personRole)).toBe(true);

      // Exactly one h1 is rendered: "About Us"
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
      expect(h1Matches).not.toBeNull();
      expect(h1Matches?.length).toBe(1);
      expect(h1Matches?.[0]).toContain("About Us");
      expect(h1Matches?.[0]).not.toContain(FOUNDER.name);
    });
  });
});
