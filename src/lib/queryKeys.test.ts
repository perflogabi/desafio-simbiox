import { describe, expect, it } from "vitest";
import { cardQueryKeys } from "./queryKeys";

describe("cardQueryKeys", () => {
  it("keeps search keys under the cards namespace", () => {
    expect(cardQueryKeys.search({ query: "lotus" })).toEqual([
      "cards",
      "search",
      { query: "lotus" },
    ]);
  });

  it("changes the key when the text or a filter changes", () => {
    const first = cardQueryKeys.search({ query: "lotus" });
    const withRarity = cardQueryKeys.search({ query: "lotus", rarity: "rare" });
    const otherText = cardQueryKeys.search({ query: "etali" });

    expect(withRarity).not.toEqual(first);
    expect(otherText).not.toEqual(first);
  });
});
