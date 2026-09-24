"use client";

import { useState } from "react";
import { CardGrid } from "@/components/CardGrid/CardGrid";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { CardSkeletonGrid } from "@/components/Skeleton/CardSkeleton";
import { useCards } from "@/hooks/useCards";
import { CardSearchError } from "@/services/scryfall/types";
import type { CardSearchFilters } from "@/types/card";
import styles from "./Explorer.module.css";

const VISIBLE_BATCH = 18;

type SearchResultsProps = {
  filters: CardSearchFilters | null;
  favoriteIds: ReadonlySet<string>;
  selectedId: string | null;
  onSelect: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
};

export function SearchResults({
  filters,
  favoriteIds,
  selectedId,
  onSelect,
  onToggleFavorite,
}: SearchResultsProps) {
  const search = useCards(filters);
  const identity =
    filters === null ? "idle" : `${filters.query}|${filters.color ?? ""}`;
  const [windowState, setWindowState] = useState({
    identity,
    count: VISIBLE_BATCH,
  });

  if (windowState.identity !== identity) {
    setWindowState({ identity, count: VISIBLE_BATCH });
  }

  const visibleCount =
    windowState.identity === identity ? windowState.count : VISIBLE_BATCH;
  const fetched = search.data?.pages.flatMap((page) => page.cards) ?? [];
  const total = search.data?.pages[0]?.total ?? 0;
  const shown = fetched.slice(0, visibleCount);
  const canRevealMore = visibleCount < fetched.length || search.hasNextPage;

  if (filters === null) {
    return (
      <EmptyState
        title="Busque uma carta"
        description="Digite um nome ou escolha uma cor para explorar o Scryfall."
      />
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
        selectedId={selectedId}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
      {search.isFetchNextPageError ? (
        <ErrorState
          title="Não foi possível carregar mais cartas"
          description="Tente novamente."
          onRetry={() => {
            void search.fetchNextPage();
          }}
        />
      ) : null}
      {canRevealMore ? (
        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.more}
            disabled={search.isFetchingNextPage}
            onClick={() => {
              const nextCount = visibleCount + VISIBLE_BATCH;
              setWindowState({ identity, count: nextCount });

              if (nextCount > fetched.length && search.hasNextPage) {
                void search.fetchNextPage();
              }
            }}
          >
            {search.isFetchingNextPage ? "Carregando" : "Carregar mais"}
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
