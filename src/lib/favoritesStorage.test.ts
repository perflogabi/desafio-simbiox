import { describe, expect, it } from "vitest";
import type { Card } from "@/types/card";
import { parseFavorites, toggleStoredFavorite } from "@/lib/favoritesStorage";

const konrad: Card = {
  id: "konrad",
  name: "Syr Konrad, the Grim",
  typeLine: "Legendary Creature — Human Knight",
  oracleText: null,
  manaCost: "{3}{B}{B}",
  colors: ["B"],
  rarity: "uncommon",
  setCode: "dsc",
  setName: "Duskmourn",
  releasedAt: null,
  artist: null,
  power: "5",
  toughness: "4",
  images: null,
};

describe("favorites storage", () => {
  it("drops malformed payloads", () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites("{")).toEqual([]);
    expect(parseFavorites('{"id":"konrad"}')).toEqual([]);
    expect(parseFavorites(JSON.stringify([konrad, { id: "broken" }]))).toEqual([
      konrad,
    ]);
  });

  it("adds a card and removes it by id", () => {
    const saved = toggleStoredFavorite([], konrad);

    expect(saved).toEqual([konrad]);
    expect(toggleStoredFavorite(saved, konrad)).toEqual([]);
  });
});
