"use client";

import { useState } from "react";
import { CardGrid } from "@/components/CardGrid/CardGrid";
import { ColorFilter } from "@/components/ColorFilter/ColorFilter";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { SectionRule } from "@/components/SectionRule/SectionRule";
import type { Card, CardColorFilter } from "@/types/card";
import { filterCards } from "@/utils/filterCards";
import styles from "./Explorer.module.css";

type ExplorerProps = {
  cards: readonly Card[];
};

export function Explorer({ cards }: ExplorerProps) {
  const [query, setQuery] = useState("");
  const [color, setColor] = useState<CardColorFilter | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visibleCards = filterCards(cards, query, color);

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
      <p className={styles.count} role="status">
        {visibleCards.length} de {cards.length}
      </p>
      {visibleCards.length === 0 ? (
        <EmptyState
          title="Nenhuma carta encontrada"
          description="Tente outra busca."
        />
      ) : (
        <CardGrid
          cards={visibleCards}
          favoriteIds={favoriteIds}
          selectedId={selectedId}
          onSelect={selectCard}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </main>
  );
}
