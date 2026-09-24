import {
  CARD_RARITIES,
  MANA_COLORS,
  type Card,
  type CardImages,
  type CardPage,
  type CardRarity,
  type CardSearchParams,
  type ManaColor,
} from "@/types/card";
import { buildSearchQuery } from "./query";
import { CardSearchError } from "./types";

const SEARCH_URL = "https://api.scryfall.com/cards/search";
const REQUEST_TIMEOUT_MS = 8_000;

const EMPTY_PAGE: CardPage = {
  cards: [],
  total: 0,
  hasMore: false,
  nextPage: null,
};

export async function searchCards(
  params: CardSearchParams,
  signal?: AbortSignal,
): Promise<CardPage> {
  const q = buildSearchQuery(params.query, params.color);

  if (q.length === 0) {
    return EMPTY_PAGE;
  }

  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("unique", "cards");
  url.searchParams.set("order", "name");

  // The browser already sends User-Agent and does not let the page replace it.
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: combineSignals(signal),
  }).catch((error: unknown) => {
    if (signal?.aborted) {
      throw error;
    }

    throw new CardSearchError("network");
  });

  const body = await readJson(response);

  if (response.status === 404) {
    return EMPTY_PAGE;
  }

  if (response.status === 400) {
    throw new CardSearchError("invalid");
  }

  if (!response.ok) {
    throw new CardSearchError("unavailable");
  }

  if (!isRecord(body) || body.object !== "list" || !Array.isArray(body.data)) {
    throw new CardSearchError("unexpected");
  }

  const cards = body.data
    .map((entry) => toCard(entry))
    .filter((card): card is Card => card !== null);
  const hasMore = body.has_more === true;

  return {
    cards,
    total:
      typeof body.total_cards === "number" ? body.total_cards : cards.length,
    hasMore,
    nextPage: hasMore ? params.page + 1 : null,
  };
}

function combineSignals(parent?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  if (!parent) {
    return timeout;
  }

  return AbortSignal.any([parent, timeout]);
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function toCard(value: unknown): Card | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = text(value.id);
  const name = text(value.name);

  if (!id || !name) {
    return null;
  }

  const faces = records(value.card_faces);
  const front = faces[0];

  return {
    id,
    name,
    typeLine: text(value.type_line) ?? text(front?.type_line) ?? "",
    oracleText: firstText(value.oracle_text, faces, "oracle_text"),
    manaCost: text(value.mana_cost) ?? text(front?.mana_cost),
    colors: toColors(value.colors),
    rarity: toRarity(value.rarity),
    setCode: text(value.set) ?? "",
    setName: text(value.set_name) ?? "",
    releasedAt: text(value.released_at),
    artist: text(value.artist) ?? text(front?.artist),
    power: text(value.power) ?? text(front?.power),
    toughness: text(value.toughness) ?? text(front?.toughness),
    images: toImages(value.image_uris) ?? toImages(front?.image_uris),
  };
}

function firstText(
  own: unknown,
  faces: readonly Record<string, unknown>[],
  key: "oracle_text",
): string | null {
  const direct = text(own);

  if (direct) {
    return direct;
  }

  const parts = faces
    .map((face) => text(face[key]))
    .filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join("\n") : null;
}

function toImages(value: unknown): CardImages | null {
  if (!isRecord(value)) {
    return null;
  }

  const normal = text(value.normal);
  const small = text(value.small) ?? normal;

  if (!normal || !small) {
    return null;
  }

  return { small, normal };
}

function toColors(value: unknown): ManaColor[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((color): color is ManaColor => isManaColor(color));
}

function toRarity(value: unknown): CardRarity {
  if (isRarity(value)) {
    return value;
  }

  return "special";
}

function isManaColor(value: unknown): value is ManaColor {
  return MANA_COLORS.some((color) => color === value);
}

function isRarity(value: unknown): value is CardRarity {
  return CARD_RARITIES.some((rarity) => rarity === value);
}

function records(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord);
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
