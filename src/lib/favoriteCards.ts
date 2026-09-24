import type { Card } from "@/types/card";
import { parseFavorites, toggleStoredFavorite } from "@/lib/favoritesStorage";

const STORAGE_KEY = "card-explorer.favorites";
const CHANGE_EVENT = "card-explorer:favorites";
const EMPTY: readonly Card[] = [];

let raw: string | null | undefined;
let snapshot: readonly Card[] = EMPTY;

export function getFavoriteCards(): readonly Card[] {
  if (typeof window === "undefined") {
    return EMPTY;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === raw) {
    return snapshot;
  }

  raw = stored;
  snapshot = parseFavorites(stored);
  return snapshot;
}

export function getServerFavoriteCards(): readonly Card[] {
  return EMPTY;
}

export function subscribeFavorites(onStoreChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function commitFavorites(cards: readonly Card[]): void {
  const serialized = JSON.stringify(cards);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  raw = serialized;
  snapshot = cards;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleFavoriteCard(card: Card): void {
  commitFavorites(toggleStoredFavorite(getFavoriteCards(), card));
}

export function formatFavoriteCount(count: number): string {
  if (count === 1) {
    return "1 carta";
  }

  return `${count} cartas`;
}
