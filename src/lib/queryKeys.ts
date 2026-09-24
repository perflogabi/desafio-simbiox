import type { CardSearchFilters } from "@/types/card";

export const cardQueryKeys = {
  all: ["cards"] as const,
  search: (filters: CardSearchFilters) =>
    [...cardQueryKeys.all, "search", filters] as const,
};
