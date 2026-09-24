"use client";

import { useState } from "react";
import { CardGrid } from "@/components/CardGrid/CardGrid";
import { CardModal } from "@/components/CardModal/CardModal";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { CardSkeletonGrid } from "@/components/Skeleton/CardSkeleton";
import { useCards } from "@/hooks/useCards";
import { CardSearchError } from "@/services/scryfall/types";
import type { Card, CardSearchFilters } from "@/types/card";
import styles from "./Explorer.module.css";

const VISIBLE_BATCH = 18;
const MAX_CARDS = 25;

type SearchResultsProps = {
  filters: CardSearchFilters | null;
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (card: Card) => void;
};

export function SearchResults({
  filters,
  favoriteIds,
  onToggleFavorite,
}: SearchResultsProps) {
  const search = useCards(filters);
  const identity =
    filters === null
      ? "idle"
      : `${filters.query}|${filters.rarity ?? ""}|${filters.type ?? ""}`;
  const [windowState, setWindowState] = useState({
    identity,
    count: VISIBLE_BATCH,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (windowState.identity !== identity) {
    setWindowState({ identity, count: VISIBLE_BATCH });

    if (selectedId !== null) {
      setSelectedId(null);
    }
  }

  const visibleCount =
    windowState.identity === identity ? windowState.count : VISIBLE_BATCH;
  const activeId = windowState.identity === identity ? selectedId : null;
  const fetched = (
    search.data?.pages.flatMap((page) => page.cards) ?? []
  ).slice(0, MAX_CARDS);
  const total = Math.min(search.data?.pages[0]?.total ?? 0, MAX_CARDS);
  const shown = fetched.slice(0, visibleCount);
  const canRevealMore = visibleCount < fetched.length;
  const selectedCard = fetched.find((card) => card.id === activeId) ?? null;

  function toggleShown(cardId: string) {
    const card = fetched.find((item) => item.id === cardId);

    if (card) {
      onToggleFavorite(card);
    }
  }

  if (filters === null) {
    return (
      <section className={styles.hint}>
        <h2 className={styles.hintTitle}>As cartas aparecem aqui</h2>
        <p className={styles.hintText}>
          Busque pelo nome ou filtre por raridade e tipo.
        </p>
      </section>
    );
  }

  if (search.isLoading) {
    return (
      <>
        <p className="visuallyHidden" role="status">
          Carregando cartas
        </p>
        <CardSkeletonGrid />
      </>
    );
  }

  if (search.isError && fetched.length === 0) {
    const message = messageFor(search.error);

    return (
      <ErrorState
        title={message.title}
        description={message.description}
        onRetry={() => {
          void search.refetch();
        }}
      />
    );
  }

  if (shown.length === 0) {
    return (
      <>
        <p className="visuallyHidden" role="status">
          Nenhuma carta encontrada
        </p>
        <EmptyState
          title="Nenhuma carta encontrada"
          description="Tente outra busca."
        />
      </>
    );
  }

  return (
    <section aria-busy={search.isFetching}>
      <p className={styles.count} role="status">
        {shown.length} de {total}
      </p>
      <CardGrid
        cards={shown}
        favoriteIds={favoriteIds}
        selectedId={activeId}
        onSelect={setSelectedId}
        onToggleFavorite={(cardId) => {
          toggleShown(cardId);
        }}
      />
      {selectedCard ? (
        <CardModal
          card={selectedCard}
          isFavorite={favoriteIds.has(selectedCard.id)}
          onClose={() => {
            setSelectedId(null);
          }}
          onToggleFavorite={() => {
            onToggleFavorite(selectedCard);
          }}
        />
      ) : null}
      {canRevealMore ? (
        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.more}
            onClick={() => {
              setWindowState({
                identity,
                count: Math.min(visibleCount + VISIBLE_BATCH, MAX_CARDS),
              });
            }}
          >
            Carregar mais
          </button>
        </div>
      ) : null}
    </section>
  );
}

function messageFor(error: unknown): { title: string; description: string } {
  if (error instanceof CardSearchError && error.kind === "network") {
    return {
      title: "Sem conexão com o Scryfall",
      description: "Verifique sua conexão e tente novamente.",
    };
  }

  if (error instanceof CardSearchError && error.kind === "invalid") {
    return {
      title: "Não foi possível fazer essa busca",
      description: "Tente outros termos.",
    };
  }

  return {
    title: "Não foi possível carregar as cartas",
    description: "O serviço pode estar indisponível. Tente novamente.",
  };
}
