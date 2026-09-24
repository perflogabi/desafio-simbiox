import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

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
});
