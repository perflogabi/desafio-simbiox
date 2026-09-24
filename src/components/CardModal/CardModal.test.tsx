import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import type { Card as MagicCard } from "@/types/card";
import { CardModal } from "./CardModal";

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

function Harness() {
  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Abrir
      </button>
      {open ? (
        <CardModal
          card={card}
          isFavorite={favorite}
          onClose={() => {
            setOpen(false);
          }}
          onToggleFavorite={() => {
            setFavorite((current) => !current);
          }}
        />
      ) : null}
    </>
  );
}

function openDialog() {
  const opener = screen.getByRole("button", { name: "Abrir" });
  opener.focus();
  fireEvent.click(opener);
  return screen.getByRole("dialog", { name: "Syr Konrad, the Grim" });
}

describe("CardModal", () => {
  it("shows the card details", () => {
    render(<Harness />);
    const dialog = openDialog();

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Legendary Creature — Human Knight").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Incomum")).toBeInTheDocument();
    expect(
      screen.getByText("Duskmourn: House of Horror Commander (DSC)"),
    ).toBeInTheDocument();
    expect(screen.getByText("27 de setembro de 2024")).toBeInTheDocument();
    expect(screen.getByText("Anna Steinbauer")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Whenever another creature dies, Syr Konrad deals 1 damage.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Ilustração de Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
  });

  it("returns focus to the opener when closed", () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Abrir" });
    openDialog();

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("closes with Escape and returns focus", () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Abrir" });
    openDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("keeps Shift+Tab inside when the dialog itself is focused", () => {
    render(<Harness />);
    const dialog = openDialog();
    const favorite = screen.getByRole("button", {
      name: "Salvar nos favoritos",
    });

    expect(dialog).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    expect(favorite).toHaveFocus();
  });

  it("keeps Tab inside the dialog", () => {
    render(<Harness />);
    openDialog();
    const close = screen.getByRole("button", { name: "Fechar" });
    const favorite = screen.getByRole("button", {
      name: "Salvar nos favoritos",
    });

    favorite.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(favorite).toHaveFocus();
  });

  it("toggles the favorite from the dialog", () => {
    render(<Harness />);
    openDialog();

    fireEvent.click(
      screen.getByRole("button", { name: "Salvar nos favoritos" }),
    );

    expect(
      screen.getByRole("button", { name: "Remover dos favoritos" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
