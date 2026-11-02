import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
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
});
