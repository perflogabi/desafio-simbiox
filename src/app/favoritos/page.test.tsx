import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FavoritesPage from "./page";

describe("FavoritesPage", () => {
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
});
