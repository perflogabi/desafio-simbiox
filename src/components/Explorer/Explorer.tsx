"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/Filters/FilterBar";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { SectionRule } from "@/components/SectionRule/SectionRule";
import { useDebounce } from "@/hooks/useDebounce";
import { hrefForFilters, readAppliedFilters } from "@/lib/urlFilters";
import type { CardSearchFilters } from "@/types/card";
import styles from "./Explorer.module.css";
import { SearchResults } from "./SearchResults";

type ExplorerProps = {
  debounceMs?: number;
};

export function Explorer({ debounceMs = 300 }: ExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const applied = readAppliedFilters(useSearchParams());
  const appliedQuery = applied.query;
  const appliedRarity = applied.rarity;
  const appliedType = applied.type;
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [text, setText] = useState(appliedQuery);
  const [seenQuery, setSeenQuery] = useState(appliedQuery);
  const debouncedQuery = useDebounce(text, debounceMs);

  if (appliedQuery !== seenQuery) {
    setSeenQuery(appliedQuery);

    if (appliedQuery !== debouncedQuery.trim()) {
      setText(appliedQuery);
    }
  }

  useEffect(() => {
    const nextQuery = debouncedQuery.trim();

    if (
      nextQuery === appliedQuery ||
      (text.trim() === appliedQuery && nextQuery !== text.trim())
    ) {
      return;
    }

    router.replace(
      hrefForFilters(pathname, {
        query: nextQuery,
        rarity: appliedRarity,
        type: appliedType,
      }),
      { scroll: false },
    );
  }, [
    appliedQuery,
    appliedRarity,
    appliedType,
    debouncedQuery,
    pathname,
    router,
    text,
  ]);

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

  function replaceFilters(next: typeof applied) {
    router.replace(hrefForFilters(pathname, next), { scroll: false });
  }

  return (
    <main id="conteudo">
      <h1 className="visuallyHidden">Explorar</h1>
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <div className={styles.search}>
            <SearchBar value={text} onValueChange={setText} />
          </div>
          <FilterBar
            applied={applied}
            onApply={(draft) => {
              replaceFilters({
                query: text.trim(),
                rarity: draft.rarity,
                type: draft.type,
              });
            }}
            onClear={() => {
              replaceFilters({
                query: text.trim(),
                rarity: null,
                type: null,
              });
            }}
            onRemove={(kind) => {
              replaceFilters({
                query: text.trim(),
                rarity: kind === "rarity" ? null : appliedRarity,
                type: kind === "type" ? null : appliedType,
              });
            }}
          />
        </div>
      </div>
      <SectionRule />
      <SearchResults
        filters={toFilters({
          query: debouncedQuery,
          rarity: appliedRarity,
          type: appliedType,
        })}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}

function toFilters(applied: {
  query: string;
  rarity: CardSearchFilters["rarity"] | null;
  type: CardSearchFilters["type"] | null;
}): CardSearchFilters | null {
  const query = applied.query.trim();

  if (query.length === 0 && applied.rarity === null && applied.type === null) {
    return null;
  }

  return {
    query,
    ...(applied.rarity ? { rarity: applied.rarity } : {}),
    ...(applied.type ? { type: applied.type } : {}),
  };
}
