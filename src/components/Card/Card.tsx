"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import type { Card as MagicCard, ManaColor } from "@/types/card";
import { ManaCost } from "./ManaCost";
import styles from "./Card.module.css";

const RARITY_LABELS = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Rara",
  mythic: "Mítica",
  special: "Especial",
  bonus: "Bônus",
} as const;

type CardFrame = ManaColor | "C" | "M";

type CardProps = {
  card: MagicCard;
  isFavorite: boolean;
  isSelected: boolean;
  imagePriority?: boolean;
  onSelect: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
};

export function Card({
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
  const frame = frameFor(card);
  const showImage = card.images !== null && !imageFailed;
  const hasPower =
    card.power !== null &&
    card.toughness !== null &&
    card.power !== "" &&
    card.toughness !== "";

  return (
    <article
      className={styles.card}
      data-frame={frame}
      data-selected={isSelected}
    >
      <button
        type="button"
        className={styles.open}
        aria-labelledby={`${nameId} ${typeId}`}
        onClick={() => {
          onSelect(card.id);
        }}
      />
      <div className={styles.heading}>
        <h2 id={nameId} className={styles.name}>
          {card.name}
        </h2>
        {card.manaCost ? <ManaCost cost={card.manaCost} /> : null}
        <div className={styles.favorite}>
          <FavoriteButton
            cardName={card.name}
            pressed={isFavorite}
            tone={frame === "W" ? "light" : "dark"}
            onToggle={() => {
              onToggleFavorite(card.id);
            }}
          />
        </div>
      </div>
      <div className={styles.imageWrap}>
        {showImage && card.images ? (
          <Image
            className={styles.image}
            src={card.images.normal}
            alt={`Ilustração de ${card.name}`}
            width={488}
            height={680}
            sizes="(max-width: 719px) 100vw, (max-width: 1099px) 50vw, 33vw"
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
      <div className={styles.typeRow}>
        <p id={typeId} className={styles.type}>
          {card.typeLine}
        </p>
        <span className={styles.set}>{card.setCode}</span>
      </div>
      <div className={styles.oracleBlock}>
        {card.oracleText ? (
          <p className={styles.oracle}>{card.oracleText}</p>
        ) : null}
        {hasPower ? (
          <span className={styles.power}>
            {card.power}/{card.toughness}
          </span>
        ) : null}
      </div>
      <footer className={styles.footer}>
        <span className={styles.rarity}>{RARITY_LABELS[card.rarity]}</span>
        {card.artist ? (
          <span className={styles.artist}>{card.artist}</span>
        ) : null}
      </footer>
    </article>
  );
}

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
