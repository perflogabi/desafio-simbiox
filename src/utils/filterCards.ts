import type { Card, CardColorFilter } from "@/types/card";

export function filterCards(
  cards: readonly Card[],
  query: string,
  color: CardColorFilter | null,
): Card[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  return cards.filter((card) => {
    const haystack = `${card.name} ${card.typeLine}`.toLocaleLowerCase("pt-BR");
    const matchesQuery =
      normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
    const matchesColor =
      color === null ||
      (color === "colorless"
        ? card.colors.length === 0
        : card.colors.includes(color));

    return matchesQuery && matchesColor;
  });
}
