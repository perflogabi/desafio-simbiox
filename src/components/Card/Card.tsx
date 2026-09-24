"use client";

import Image from "next/image";
import { memo, useId, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import type { Card as MagicCard, ManaColor } from "@/types/card";
import styles from "./Card.module.css";

type CardFrame = ManaColor | "C" | "M";

type CardProps = {
  card: MagicCard;
  isFavorite: boolean;
  isSelected: boolean;
  imagePriority?: boolean;
  onSelect: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
};

export const Card = memo(function Card({
  card,
  isFavorite,
  isSelected,
  imagePriority = false,
  onSelect,
  onToggleFavorite,
}: CardProps) {
  const nameId = useId();
  const typeId = useId();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = card.images !== null && !imageFailed;

  return (
    <article
      className={styles.card}
      data-frame={frameFor(card)}
      data-selected={isSelected}
    >
      <h2 id={nameId} className="visuallyHidden">
        {card.name}
      </h2>
      <p id={typeId} className="visuallyHidden">
        {card.typeLine}
      </p>
      <div className={styles.face}>
        <button
          type="button"
          className={styles.open}
          aria-labelledby={`${nameId} ${typeId}`}
          aria-haspopup="dialog"
          aria-expanded={isSelected}
          onClick={() => {
            onSelect(card.id);
          }}
        />
        {showImage && card.images ? (
          <Image
            className={styles.image}
            src={card.images.normal}
            alt={`Ilustração de ${card.name}`}
            width={488}
            height={680}
            sizes="(max-width: 540px) calc(100vw - 2rem), (max-width: 960px) calc(50vw - 2rem), 22rem"
            priority={imagePriority}
            onError={() => {
              setImageFailed(true);
            }}
          />
        ) : (
          <div
            className={styles.fallback}
            role="img"
            aria-label={`Ilustração indisponível de ${card.name}`}
          >
            {card.name}
          </div>
        )}
      </div>
      <div className={styles.favorite}>
        <FavoriteButton
          cardName={card.name}
          pressed={isFavorite}
          onToggle={() => {
            onToggleFavorite(card.id);
          }}
        />
      </div>
    </article>
  );
});

function frameFor(card: MagicCard): CardFrame {
  const [onlyColor] = card.colors;

  if (onlyColor === undefined) {
    return "C";
  }

  if (card.colors.length > 1) {
    return "M";
  }

  return onlyColor;
}
