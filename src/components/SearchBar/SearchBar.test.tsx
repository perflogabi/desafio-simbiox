import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("associates the label and reports typed text", () => {
    const onValueChange = vi.fn();

    render(<SearchBar value="" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "lotus" },
    });

    expect(onValueChange).toHaveBeenCalledWith("lotus");
  });

  it("keeps the submitted text in the field", () => {
    function Harness() {
      const [value, setValue] = useState("");

      return <SearchBar value={value} onValueChange={setValue} />;
    }

    render(<Harness />);

    const searchbox = screen.getByRole("searchbox", { name: "Buscar cartas" });
    fireEvent.change(searchbox, { target: { value: "konrad" } });

    const form = searchbox.closest("form");
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("Campo de busca sem formulário");
    }

    fireEvent.submit(form);

    expect(searchbox).toHaveValue("konrad");
  });
});
