import { describe, expect, test } from "bun:test";
import { formatCities } from "./top-contact-bar";

describe("formatCities helper", () => {
  test("returns empty string when address list is empty", () => {
    expect(formatCities([])).toBe("");
  });

  test("returns single city name without conjunction when exactly one address", () => {
    expect(formatCities([{ label: "Mumbai" }])).toBe("Mumbai");
  });

  test("joins two cities with 'and'", () => {
    expect(formatCities([{ label: "Mumbai" }, { label: "Pune" }])).toBe(
      "Mumbai and Pune",
    );
  });

  test("joins three or more cities with commas and terminal 'and'", () => {
    expect(
      formatCities([
        { label: "Mumbai" },
        { label: "Pune" },
        { label: "Delhi" },
      ]),
    ).toBe("Mumbai, Pune and Delhi");
  });

  test("ignores empty or whitespace-only labels", () => {
    expect(
      formatCities([{ label: "Mumbai" }, { label: "   " }, { label: "Pune" }]),
    ).toBe("Mumbai and Pune");
  });
});
