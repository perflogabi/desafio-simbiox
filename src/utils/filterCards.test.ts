import { describe, expect, it } from "vitest";
import { sampleCards } from "@/fixtures/sampleCards";
import { filterCards } from "./filterCards";

describe("filterCards", () => {
  it("matches name and type without case sensitivity", () => {
    expect(
      filterCards(sampleCards, "KNIGHT", null).map((card) => card.name),
    ).toEqual(["Syr Konrad, the Grim"]);
  });

  it("filters by color and by the absence of color", () => {
    expect(filterCards(sampleCards, "", "U").map((card) => card.name)).toEqual([
      "Ledger Shredder",
    ]);
    expect(
      filterCards(sampleCards, "", "colorless").map((card) => card.name),
    ).toEqual(["Solemn Simulacrum"]);
  });

  it("returns nothing when query and color disagree", () => {
    expect(filterCards(sampleCards, "konrad", "R")).toEqual([]);
  });
});
