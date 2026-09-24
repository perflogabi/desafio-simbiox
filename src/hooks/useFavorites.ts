"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getFavoriteCards,
  getServerFavoriteCards,
  subscribeFavorites,
  toggleFavoriteCard,
} from "@/lib/favoriteCards";
import type { Card } from "@/types/card";

export function useFavorites() {
  const cards = useSyncExternalStore(
    subscribeFavorites,
    getFavoriteCards,
    getServerFavoriteCards,
  );
  const ids = useMemo(() => new Set(cards.map((card) => card.id)), [cards]);
  const toggle = useCallback((card: Card) => {
    toggleFavoriteCard(card);
  }, []);

  return { cards, ids, toggle };
}
