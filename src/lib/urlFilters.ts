import {
  SEARCH_RARITIES,
  SEARCH_TYPES,
  type SearchRarity,
  type SearchType,
} from "@/types/card";

export type AppliedFilters = {
  query: string;
  rarity: SearchRarity | null;
  type: SearchType | null;
};

type ParamSource = {
  get(name: string): string | null;
};

export function readAppliedFilters(params: ParamSource): AppliedFilters {
  return {
    query: params.get("q")?.trim() ?? "",
    rarity: parseRarity(params.get("rarity")),
    type: parseType(params.get("type")),
  };
}

export function hrefForFilters(
  pathname: string,
  filters: AppliedFilters,
): string {
  const params = new URLSearchParams();
  const query = filters.query.trim();

  if (query.length > 0) {
    params.set("q", query);
  }

  if (filters.rarity) {
    params.set("rarity", filters.rarity);
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  const search = params.toString();

  return search.length > 0 ? `${pathname}?${search}` : pathname;
}

function parseRarity(value: string | null): SearchRarity | null {
  if (value !== null && isSearchRarity(value)) {
    return value;
  }

  return null;
}

function parseType(value: string | null): SearchType | null {
  if (value !== null && isSearchType(value)) {
    return value;
  }

  return null;
}

function isSearchRarity(value: string): value is SearchRarity {
  return SEARCH_RARITIES.some((rarity) => rarity === value);
}

function isSearchType(value: string): value is SearchType {
  return SEARCH_TYPES.some((type) => type === value);
}
