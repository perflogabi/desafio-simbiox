import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Explorer } from "@/components/Explorer/Explorer";
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

    resolveFetch(jsonResponse(listOf(["Syr Konrad, the Grim"])));

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
