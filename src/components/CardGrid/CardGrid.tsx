import { Card } from "@/components/Card/Card";
import type { Card as MagicCard } from "@/types/card";
import styles from "./CardGrid.module.css";

type CardGridProps = {
  cards: readonly MagicCard[];
  favoriteIds: ReadonlySet<string>;
  selectedId: string | null;
  label?: string;
  onSelect: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
};

export function CardGrid({
  cards,
  favoriteIds,
  selectedId,
  label = "Resultados da busca",
  onSelect,
  onToggleFavorite,
}: CardGridProps) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {cards.map((card, index) => (
        <li key={card.id}>
          <Card
            card={card}
            isFavorite={favoriteIds.has(card.id)}
            isSelected={selectedId === card.id}
            imagePriority={index < 3}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
