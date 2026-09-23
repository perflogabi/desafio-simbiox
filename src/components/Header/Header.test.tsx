import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Header", () => {
  it("marks Explorar as the current section", () => {
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Explorador de Cartas" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Explorar" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Favoritos" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
