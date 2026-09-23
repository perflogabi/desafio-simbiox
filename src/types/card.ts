export const MANA_COLORS = ["W", "U", "B", "R", "G"] as const;

export type ManaColor = (typeof MANA_COLORS)[number];

/** Filtro de busca. "colorless" não é uma cor da carta; é a ausência de cores. */
export type CardColorFilter = ManaColor | "colorless";

export const CARD_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "mythic",
  "special",
  "bonus",
] as const;

export type CardRarity = (typeof CARD_RARITIES)[number];

export interface CardImages {
  small: string;
  normal: string;
}

/**
 * Carta como a interface consome. Campos opcionais no Scryfall ficam nulos
 * em vez de serem omitidos, para o restante da aplicação não depender de
 * presença implícita.
 */
export interface Card {
  id: string;
  name: string;
  typeLine: string;
  oracleText: string | null;
  manaCost: string | null;
  colors: readonly ManaColor[];
  rarity: CardRarity;
  setCode: string;
  setName: string;
  releasedAt: string | null;
  artist: string | null;
  power: string | null;
  toughness: string | null;
  images: CardImages | null;
}

export interface CardSearchParams {
  query: string;
  page: number;
  color?: CardColorFilter;
}

export interface CardPage {
  cards: readonly Card[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
}
