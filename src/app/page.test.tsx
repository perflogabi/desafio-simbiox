import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the compendium and sample cards", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Compêndio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Buscar cartas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
  });

  it("shows an empty state when the search matches nothing", () => {
    render(<HomePage />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "carta inexistente" },
    });

    expect(
      screen.getByRole("heading", { name: "Nenhuma carta encontrada" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0 de 8");
  });
});
