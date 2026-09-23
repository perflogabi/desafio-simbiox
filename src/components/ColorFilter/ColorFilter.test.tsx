import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorFilter } from "./ColorFilter";

describe("ColorFilter", () => {
  it("selects a color and clears it when pressed again", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <ColorFilter value={null} onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Preto" }));
    expect(onChange).toHaveBeenCalledWith("B");

    rerender(<ColorFilter value="B" onChange={onChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Preto", pressed: true }),
    );
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
