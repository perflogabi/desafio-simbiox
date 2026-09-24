import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Explorer } from "@/components/Explorer/Explorer";
import { getSearchParams, resetSearchParams } from "@/test/navigationState";
import { renderWithClient } from "@/test/renderWithClient";

describe("Explorer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows skeletons and then the cards returned by Scryfall", async () => {
    let resolveFetch: (response: Response) => void = () => undefined;
    const pending = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pending));

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "konrad" },
    });

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Carregando cartas",
    );

    await act(async () => {
      resolveFetch(jsonResponse(listOf(["Syr Konrad, the Grim"])));
      await pending;
    });

    expect(
      await screen.findByRole("heading", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 de 1");
  });

  it("shows an empty state when Scryfall has no matches", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ object: "error", code: "not_found" }, 404),
        ),
    );

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "inexistente" },
    });

    expect(
      await screen.findByRole("heading", { name: "Nenhuma carta encontrada" }),
    ).toBeInTheDocument();
  });

  it("shows a connection error and retries", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(jsonResponse(listOf(["Black Lotus"])));
    vi.stubGlobal("fetch", fetchMock);

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "lotus" },
    });

    expect(
      await screen.findByRole("heading", {
        name: "Sem conexão com o Scryfall",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(
      await screen.findByRole("heading", { name: "Black Lotus" }),
    ).toBeInTheDocument();
  });

  it("reveals another batch without requesting the next API page", async () => {
    const names = Array.from(
      { length: 19 },
      (_, index) => `Carta ${index + 1}`,
    );
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(listOf(names)));
    vi.stubGlobal("fetch", fetchMock);

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "carta" },
    });

    expect(
      await screen.findByRole("heading", { name: /^Carta 1$/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /^Carta 19$/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Carregar mais" }));

    expect(
      screen.getByRole("heading", { name: /^Carta 19$/ }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("opens card details and closes them with Escape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(listOf(["Syr Konrad, the Grim"]))),
    );

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar cartas" }), {
      target: { value: "konrad" },
    });

    const open = await screen.findByRole("button", {
      name: "Syr Konrad, the Grim Creature — Test",
    });
    open.focus();
    fireEvent.click(open);

    expect(
      screen.getByRole("dialog", { name: "Syr Konrad, the Grim" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("dialog", { name: "Syr Konrad, the Grim" }),
    ).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });

  it("applies rarity and type only after Aplicar and reflects them in the URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(listOf(["Dragon"])));
    vi.stubGlobal("fetch", fetchMock);

    renderWithClient(<Explorer debounceMs={0} />);
    const filters = screen.getByRole("button", { name: "Filtros" });
    expect(filters).toHaveAttribute("aria-expanded", "false");
    filters.focus();
    fireEvent.click(filters);

    expect(filters).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Rara" }));
    fireEvent.click(screen.getByRole("button", { name: /^Tipo/ }));
    fireEvent.click(screen.getByRole("option", { name: "Criatura" }));

    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(
      screen.queryByRole("dialog", { name: "Filtros" }),
    ).not.toBeInTheDocument();
    expect(getSearchParams().get("rarity")).toBe("rare");
    expect(getSearchParams().get("type")).toBe("creature");
    expect(getSearchParams().get("q")).toBeNull();

    const target = fetchMock.mock.calls[0]?.[0];
    expect(target).toBeInstanceOf(URL);
    if (target instanceof URL) {
      expect(target.searchParams.get("q")).toBe("rarity:rare type:creature");
    }

    expect(
      await screen.findByRole("button", { name: "Remover filtro Rara" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remover filtro Criatura" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Filtros/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("restores filters from the URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(listOf(["Dragon"])));
    vi.stubGlobal("fetch", fetchMock);
    resetSearchParams("q=dragon&rarity=rare&type=creature");

    renderWithClient(<Explorer debounceMs={0} />);

    expect(
      screen.getByRole("searchbox", { name: "Buscar cartas" }),
    ).toHaveValue("dragon");
    expect(
      screen.getByRole("button", { name: "Remover filtro Rara" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Dragon" }),
    ).toBeInTheDocument();

    const target = fetchMock.mock.calls[0]?.[0];
    expect(target).toBeInstanceOf(URL);
    if (target instanceof URL) {
      expect(target.searchParams.get("q")).toBe(
        "dragon rarity:rare type:creature",
      );
    }
  });

  it("clears rarity and type and keeps the text search", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(listOf(["Dragon"]))),
    );
    resetSearchParams("q=dragon&rarity=rare&type=creature");

    renderWithClient(<Explorer debounceMs={0} />);
    const filters = screen.getByRole("button", { name: /Filtros/ });
    filters.focus();
    fireEvent.click(filters);
    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));

    expect(getSearchParams().get("q")).toBe("dragon");
    expect(getSearchParams().get("rarity")).toBeNull();
    expect(getSearchParams().get("type")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Remover filtro Rara" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Buscar cartas" }),
    ).toHaveValue("dragon");
  });

  it("removes one filter from its chip", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(listOf(["Dragon"]))),
    );
    resetSearchParams("q=dragon&rarity=rare&type=creature");

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Remover filtro Rara" }),
    );

    expect(getSearchParams().get("rarity")).toBeNull();
    expect(getSearchParams().get("type")).toBe("creature");
    expect(
      screen.queryByRole("button", { name: "Remover filtro Rara" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remover filtro Criatura" }),
    ).toBeInTheDocument();
  });

  it("closes the filter panel with Escape and returns focus", () => {
    renderWithClient(<Explorer debounceMs={0} />);
    const filters = screen.getByRole("button", { name: "Filtros" });
    filters.focus();
    fireEvent.click(filters);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("dialog", { name: "Filtros" }),
    ).not.toBeInTheDocument();
    expect(filters).toHaveFocus();
  });

  it("opens a dialog with a close button on a narrow screen", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(max-width: 719px)",
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    );

    renderWithClient(<Explorer debounceMs={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));

    expect(screen.getByRole("dialog", { name: "Filtros" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });
});

function listOf(names: readonly string[]) {
  return {
    object: "list",
    total_cards: names.length,
    has_more: false,
    data: names.map((name, index) => ({
      id: `card-${index}`,
      name,
      type_line: "Creature — Test",
      oracle_text: "Test.",
      mana_cost: "{1}",
      colors: ["B"],
      rarity: "common",
      set: "tst",
      set_name: "Test",
      image_uris: {
        small: "https://cards.scryfall.io/small/front/test.jpg",
        normal: "https://cards.scryfall.io/normal/front/test.jpg",
      },
    })),
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
