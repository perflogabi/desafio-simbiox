"use client";

import { useState } from "react";
import { ColorFilter } from "@/components/ColorFilter/ColorFilter";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { SectionRule } from "@/components/SectionRule/SectionRule";
import { useDebounce } from "@/hooks/useDebounce";
import type { CardColorFilter, CardSearchFilters } from "@/types/card";
import styles from "./Explorer.module.css";
import { SearchResults } from "./SearchResults";

type ExplorerProps = {
  debounceMs?: number;
};

export function Explorer({ debounceMs = 300 }: ExplorerProps) {
  const [query, setQuery] = useState("");
  const [color, setColor] = useState<CardColorFilter | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, debounceMs);
  const filters = toFilters(debouncedQuery, color);

  function toggleFavorite(cardId: string) {
    setFavoriteIds((current) => {
      const next = new Set(current);

      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }

      return next;
    });
  }

  function selectCard(cardId: string) {
    setSelectedId((current) => (current === cardId ? null : cardId));
  }

  return (
    <main id="conteudo">
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Compêndio</h1>
        <div className={styles.search}>
          <SearchBar value={query} onValueChange={setQuery} />
        </div>
        <div className={styles.colors}>
          <ColorFilter value={color} onChange={setColor} />
        </div>
      </div>
      <SectionRule />
      <SearchResults
        filters={filters}
        favoriteIds={favoriteIds}
        selectedId={selectedId}
        onSelect={selectCard}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}

function toFilters(
  query: string,
  color: CardColorFilter | null,
): CardSearchFilters | null {
  const text = query.trim();

  if (text.length === 0 && color === null) {
    return null;
  }

  if (color === null) {
    return { query: text };
  }

  return { query: text, color };
}
