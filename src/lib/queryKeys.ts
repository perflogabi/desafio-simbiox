import type { CardSearchParams } from "@/types/card";

export const cardQueryKeys = {
  all: ["cards"] as const,
  search: (params: CardSearchParams) =>
    [...cardQueryKeys.all, "search", params] as const,
};
