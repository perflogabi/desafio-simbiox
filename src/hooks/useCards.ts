import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { cardQueryKeys } from "@/lib/queryKeys";
import { searchCards } from "@/services/scryfall/api";
import type { CardPage, CardSearchFilters } from "@/types/card";

const EMPTY_PAGE: CardPage = {
  cards: [],
  total: 0,
  hasMore: false,
  nextPage: null,
};

export function useCards(filters: CardSearchFilters | null) {
  return useInfiniteQuery({
    queryKey:
      filters === null ? cardQueryKeys.all : cardQueryKeys.search(filters),
    initialPageParam: 1,
    enabled: filters !== null,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam, signal }) => {
      if (filters === null) {
        return Promise.resolve(EMPTY_PAGE);
      }

      return searchCards({ ...filters, page: pageParam }, signal);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
