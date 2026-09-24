import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithClient } from "@/test/renderWithClient";
import HomePage from "./page";

describe("HomePage", () => {
  it("invites the user to search before calling Scryfall", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderWithClient(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Compêndio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Buscar cartas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Busque uma carta" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
