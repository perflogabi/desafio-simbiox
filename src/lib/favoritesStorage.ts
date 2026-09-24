import {
  CARD_RARITIES,
  MANA_COLORS,
  type Card,
  type CardImages,
  type CardRarity,
  type ManaColor,
} from "@/types/card";

const EMPTY: readonly Card[] = [];

export function parseFavorites(raw: string | null): readonly Card[] {
  if (raw === null || raw.length === 0) {
    return EMPTY;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return EMPTY;
    }

    return parsed.filter(isCard);
  } catch {
    return EMPTY;
  }
}

export function toggleStoredFavorite(
  cards: readonly Card[],
  card: Card,
): readonly Card[] {
  if (cards.some((item) => item.id === card.id)) {
    return cards.filter((item) => item.id !== card.id);
  }

  return [card, ...cards];
}

function isCard(value: unknown): value is Card {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isText(value.id) &&
    isText(value.name) &&
    isText(value.typeLine) &&
    isNullableText(value.oracleText) &&
    isNullableText(value.manaCost) &&
    isColorList(value.colors) &&
    isRarity(value.rarity) &&
    isText(value.setCode) &&
    isText(value.setName) &&
    isNullableText(value.releasedAt) &&
    isNullableText(value.artist) &&
    isNullableText(value.power) &&
    isNullableText(value.toughness) &&
    isImages(value.images)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isText(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableText(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isColorList(value: unknown): value is readonly ManaColor[] {
  return Array.isArray(value) && value.every(isManaColor);
}

function isManaColor(value: unknown): value is ManaColor {
  return MANA_COLORS.some((color) => color === value);
}

function isRarity(value: unknown): value is CardRarity {
  return CARD_RARITIES.some((rarity) => rarity === value);
}

function isImages(value: unknown): value is CardImages | null {
  if (value === null) {
    return true;
  }

  return isRecord(value) && isText(value.small) && isText(value.normal);
}
