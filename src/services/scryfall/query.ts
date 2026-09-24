import type { SearchRarity, SearchType } from "@/types/card";

type SearchQueryInput = {
  query: string;
  rarity?: SearchRarity;
  type?: SearchType;
};

export function buildSearchQuery({
  query,
  rarity,
  type,
}: SearchQueryInput): string {
  const parts: string[] = [];
  const text = query.trim();

  if (text.length > 0) {
    parts.push(text);
  }

  if (rarity) {
    parts.push(`rarity:${rarity}`);
  }

  if (type) {
    parts.push(`type:${type}`);
  }

  return parts.join(" ");
}
