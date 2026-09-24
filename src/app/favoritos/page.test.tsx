import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { commitFavorites } from "@/lib/favoriteCards";
import type { Card } from "@/types/card";
import FavoritesPage from "./page";

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

describe("FavoritesPage", () => {
  beforeEach(() => {
    commitFavorites([]);
  });

  it("explains that there are no saved cards yet", () => {
    render(<FavoritesPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Favoritos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Nenhum favorito ainda" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voltar para explorar" }),
    ).toHaveAttribute("href", "/");
  });

  it("shows a saved card and removes it from the collection", () => {
    commitFavorites([konrad]);
    render(<FavoritesPage />);

    expect(screen.getByRole("status")).toHaveTextContent("1 carta");
    expect(
      screen.getByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Nenhum favorito ainda" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remover Syr Konrad, the Grim dos favoritos",
      }),
    );

    expect(
      screen.queryByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Nenhum favorito ainda" }),
    ).toBeInTheDocument();
  });
});
