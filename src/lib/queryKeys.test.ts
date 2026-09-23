import { describe, expect, it } from "vitest";
import { cardQueryKeys } from "./queryKeys";

describe("cardQueryKeys", () => {
  it("keeps search keys under the cards namespace", () => {
    expect(cardQueryKeys.search({ query: "lotus", page: 1 })).toEqual([
      "cards",
      "search",
      { query: "lotus", page: 1 },
    ]);
  });

  it("changes the key when the search changes", () => {
    const first = cardQueryKeys.search({ query: "lotus", page: 1 });
    const withColor = cardQueryKeys.search({
      query: "lotus",
      page: 1,
      color: "B",
    });
    const nextPage = cardQueryKeys.search({ query: "lotus", page: 2 });

    expect(withColor).not.toEqual(first);
    expect(nextPage).not.toEqual(first);
  });
});
