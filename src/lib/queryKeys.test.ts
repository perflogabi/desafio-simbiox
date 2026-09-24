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

  it("changes the key when the text or the color changes", () => {
    const first = cardQueryKeys.search({ query: "lotus" });
    const withColor = cardQueryKeys.search({ query: "lotus", color: "B" });
    const otherText = cardQueryKeys.search({ query: "etali" });

    expect(withColor).not.toEqual(first);
    expect(otherText).not.toEqual(first);
  });
});
