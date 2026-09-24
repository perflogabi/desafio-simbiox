import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { commitFavorites } from "@/lib/favoriteCards";
import type { Card } from "@/types/card";
import { Header } from "./Header";

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

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header", () => {
  it("links to favorites without an Explorar item", () => {
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Explorador de Cartas" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.queryByRole("link", { name: "Explorar" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Favoritos" })).toHaveAttribute(
      "href",
      "/favoritos",
    );
    expect(screen.getByRole("link", { name: "Favoritos" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows how many cards are saved", () => {
    commitFavorites([konrad, { ...konrad, id: "lotus", name: "Black Lotus" }]);
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Favoritos, 2 cartas" }),
    ).toHaveAttribute("href", "/favoritos");
  });
});
