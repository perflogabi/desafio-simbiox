export const MANA_COLORS = ["W", "U", "B", "R", "G"] as const;

export type ManaColor = (typeof MANA_COLORS)[number];

export const SEARCH_RARITIES = [
  "common",
  "uncommon",
  "rare",
  "mythic",
] as const;

export type SearchRarity = (typeof SEARCH_RARITIES)[number];

export const SEARCH_TYPES = [
  "creature",
  "artifact",
  "enchantment",
  "sorcery",
  "instant",
  "planeswalker",
  "land",
] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];

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

export interface CardSearchFilters {
  query: string;
  rarity?: SearchRarity;
  type?: SearchType;
}

export interface CardSearchParams extends CardSearchFilters {
  page: number;
}

export interface CardPage {
  cards: readonly Card[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
}
