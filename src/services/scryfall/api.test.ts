import { afterEach, describe, expect, it, vi } from "vitest";
import { searchCards } from "./api";
import { CardSearchError } from "./types";

const konrad = {
  id: "konrad",
  name: "Syr Konrad, the Grim",
  type_line: "Legendary Creature — Human Knight",
  oracle_text: "Whenever another creature dies, Syr Konrad deals 1 damage.",
  mana_cost: "{3}{B}{B}",
  colors: ["B", "purple"],
  rarity: "uncommon",
  set: "dsc",
  set_name: "Duskmourn: House of Horror Commander",
  released_at: "2024-09-27",
  artist: "Anna Steinbauer",
  power: "5",
  toughness: "4",
  image_uris: {
    small: "https://cards.scryfall.io/small/front/konrad.jpg",
    normal: "https://cards.scryfall.io/normal/front/konrad.jpg",
  },
};

describe("searchCards", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps a successful page and keeps only known colors", async () => {
    const fetchMock = mockFetch({
      object: "list",
      total_cards: 40,
      has_more: true,
      data: [konrad],
    });

    const page = await searchCards({ query: "konrad", page: 1 });

    expect(page.cards[0]).toMatchObject({
      id: "konrad",
      name: "Syr Konrad, the Grim",
      colors: ["B"],
      rarity: "uncommon",
      images: {
        normal: "https://cards.scryfall.io/normal/front/konrad.jpg",
      },
    });
    expect(page.total).toBe(40);
    expect(page.nextPage).toBe(2);

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.get("q")).toBe("konrad");
    expect(url.searchParams.get("unique")).toBe("cards");
  });

  it("reads the front face when the card has no top-level image", async () => {
    mockFetch({
      object: "list",
      total_cards: 1,
      has_more: false,
      data: [
        {
          id: "delver",
          name: "Delver of Secrets // Insectile Aberration",
          colors: ["U"],
          rarity: "common",
          set: "isd",
          set_name: "Innistrad",
          card_faces: [
            {
              mana_cost: "{U}",
              type_line: "Creature — Human Wizard",
              oracle_text:
                "At the beginning of your upkeep, look at the top card.",
              power: "1",
              toughness: "1",
              artist: "Nils Hamm",
              image_uris: {
                small: "https://cards.scryfall.io/small/front/delver.jpg",
                normal: "https://cards.scryfall.io/normal/front/delver.jpg",
              },
            },
          ],
        },
      ],
    });

    const page = await searchCards({ query: "delver", page: 1 });

    expect(page.cards[0]).toMatchObject({
      manaCost: "{U}",
      typeLine: "Creature — Human Wizard",
      power: "1",
      artist: "Nils Hamm",
      images: {
        normal: "https://cards.scryfall.io/normal/front/delver.jpg",
      },
    });
  });

  it("treats a missing result as an empty page", async () => {
    mockFetch({ object: "error", code: "not_found", status: 404 }, 404);

    await expect(searchCards({ query: "zzzz", page: 1 })).resolves.toEqual({
      cards: [],
      total: 0,
      hasMore: false,
      nextPage: null,
    });
  });

  it("rejects an unexpected payload", async () => {
    mockFetch({ object: "card" });

    await expect(searchCards({ query: "lotus", page: 1 })).rejects.toEqual(
      expect.any(CardSearchError),
    );
    await expect(
      searchCards({ query: "lotus", page: 1 }),
    ).rejects.toMatchObject({
      kind: "unexpected",
    });
  });

  it("reports a network failure without leaking the original error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    await expect(
      searchCards({ query: "lotus", page: 1 }),
    ).rejects.toMatchObject({
      name: "CardSearchError",
      kind: "network",
    });
  });

  it("does not call the API when the search is empty", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(searchCards({ query: "   ", page: 1 })).resolves.toMatchObject(
      {
        cards: [],
      },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
