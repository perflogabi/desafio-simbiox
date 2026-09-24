import { describe, expect, it } from "vitest";
import { buildSearchQuery } from "./query";

describe("buildSearchQuery", () => {
  it("trims the text and appends a color clause", () => {
    expect(buildSearchQuery("  lotus  ", "B")).toBe("lotus c:b");
    expect(buildSearchQuery("", "colorless")).toBe("c:c");
  });

  it("returns an empty search when nothing was informed", () => {
    expect(buildSearchQuery("   ")).toBe("");
  });
});
