import type { CardRarity } from "@/types/card";

const RARITY_LABELS: Record<CardRarity, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Rara",
  mythic: "Mítica",
  special: "Especial",
  bonus: "Bônus",
};

export function rarityLabel(rarity: CardRarity): string {
  return RARITY_LABELS[rarity];
}
