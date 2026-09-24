"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CardGrid } from "@/components/CardGrid/CardGrid";
import { CardModal } from "@/components/CardModal/CardModal";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { SectionRule } from "@/components/SectionRule/SectionRule";
import { useFavorites } from "@/hooks/useFavorites";
import { formatFavoriteCount } from "@/lib/favoriteCards";
import type { Card } from "@/types/card";
import styles from "@/app/favoritos/page.module.css";

export function FavoriteCollection() {
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const { cards, ids, toggle } = useFavorites();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cards.find((card) => card.id === selectedId) ?? null;

  function toggleCard(card: Card) {
    if (selectedId === card.id) {
      setSelectedId(null);
    }

    toggle(card);
  }

  return (
    <main id="conteudo">
      <p className={styles.eyebrow}>Coleção</p>
      <h1 className={styles.title}>Favoritos</h1>
      {cards.length > 0 ? (
        <p className={styles.count} role="status">
          {formatFavoriteCount(cards.length)}
        </p>
      ) : null}
      <SectionRule />
      {ready && cards.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Salve cartas nos resultados da busca."
          action={<Link href="/">Voltar para explorar</Link>}
        />
      ) : null}
      {cards.length > 0 ? (
        <CardGrid
          cards={cards}
          favoriteIds={ids}
          selectedId={selected?.id ?? null}
          label="Cartas favoritas"
          onSelect={setSelectedId}
          onToggleFavorite={(cardId) => {
            const card = cards.find((item) => item.id === cardId);

            if (card) {
              toggleCard(card);
            }
          }}
        />
      ) : null}
      {selected ? (
        <CardModal
          card={selected}
          isFavorite={ids.has(selected.id)}
          onClose={() => {
            setSelectedId(null);
          }}
          onToggleFavorite={() => {
            toggleCard(selected);
          }}
        />
      ) : null}
    </main>
  );
}
