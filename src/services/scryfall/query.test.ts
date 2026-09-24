import { describe, expect, it } from "vitest";
import { buildSearchQuery } from "./query";

describe("buildSearchQuery", () => {
  it("trims the text and appends rarity and type", () => {
    expect(
      buildSearchQuery({
        query: "  dragon  ",
        rarity: "rare",
        type: "creature",
      }),
    ).toBe("dragon rarity:rare type:creature");
  });

  it("searches by filter when the text is empty", () => {
    expect(buildSearchQuery({ query: "", type: "land" })).toBe("type:land");
  });

  it("returns an empty search when nothing was informed", () => {
    expect(buildSearchQuery({ query: "   " })).toBe("");
  });
});
