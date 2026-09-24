import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Card as MagicCard } from "@/types/card";
import { Card } from "./Card";

const card: MagicCard = {
  id: "konrad",
  name: "Syr Konrad, the Grim",
  typeLine: "Legendary Creature — Human Knight",
  oracleText: "Whenever another creature dies, Syr Konrad deals 1 damage.",
  manaCost: "{3}{B}{B}",
  colors: ["B"],
  rarity: "uncommon",
  setCode: "dsc",
  setName: "Duskmourn: House of Horror Commander",
  releasedAt: "2024-09-27",
  artist: "Anna Steinbauer",
  power: "5",
  toughness: "4",
  images: {
    small: "https://cards.scryfall.io/small/front/konrad.jpg",
    normal: "https://cards.scryfall.io/normal/front/konrad.jpg",
  },
};

describe("Card", () => {
  it("shows the illustration without repeating the oracle text", () => {
    render(
      <Card
        card={card}
        isFavorite={false}
        isSelected={false}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Ilustração de Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Whenever another creature dies, Syr Konrad deals 1 damage.",
      ),
    ).not.toBeInTheDocument();
  });

  it("selects the card without toggling the favorite", () => {
    const onSelect = vi.fn();
    const onToggleFavorite = vi.fn();

    render(
      <Card
        card={card}
        isFavorite={false}
        isSelected={false}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Syr Konrad, the Grim Legendary Creature — Human Knight",
      }),
    );

    expect(onSelect).toHaveBeenCalledWith("konrad");
    expect(onToggleFavorite).not.toHaveBeenCalled();
  });

  it("toggles the favorite from its own button", () => {
    const onSelect = vi.fn();
    const onToggleFavorite = vi.fn();

    render(
      <Card
        card={card}
        isFavorite={false}
        isSelected={false}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar Syr Konrad, the Grim nos favoritos",
      }),
    );

    expect(onToggleFavorite).toHaveBeenCalledWith("konrad");
    expect(onSelect).not.toHaveBeenCalled();
  });
});
