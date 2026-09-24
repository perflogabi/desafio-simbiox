import { describe, expect, it } from "vitest";
import { hrefForFilters, readAppliedFilters } from "./urlFilters";

describe("urlFilters", () => {
  it("omits empty and default parameters", () => {
    expect(hrefForFilters("/", { query: "  ", rarity: null, type: null })).toBe(
      "/",
    );
    expect(
      hrefForFilters("/", {
        query: " dragon ",
        rarity: "rare",
        type: "creature",
      }),
    ).toBe("/?q=dragon&rarity=rare&type=creature");
  });

  it("restores a shared URL and ignores unknown values", () => {
    const params = new URLSearchParams(
      "q=dragon&rarity=rare&type=creature&extra=1",
    );

    expect(readAppliedFilters(params)).toEqual({
      query: "dragon",
      rarity: "rare",
      type: "creature",
    });
    expect(
      readAppliedFilters(new URLSearchParams("rarity=special&type=token")),
    ).toEqual({
      query: "",
      rarity: null,
      type: null,
    });
  });
});
