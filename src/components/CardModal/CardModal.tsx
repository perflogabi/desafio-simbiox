"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import { ManaCost } from "@/components/Card/ManaCost";
import { rarityLabel } from "@/components/Card/rarity";
import type { Card as MagicCard } from "@/types/card";
import { formatReleaseDate } from "@/utils/formatReleaseDate";
import styles from "./CardModal.module.css";
import { useDialog } from "./useDialog";

type CardModalProps = {
  card: MagicCard;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
};

export function CardModal({
  card,
  isFavorite,
  onClose,
  onToggleFavorite,
}: CardModalProps) {
  const titleId = useId();
  const typeId = useId();
  const dialogRef = useDialog(onClose);
  const [imageFailed, setImageFailed] = useState(false);
  const releaseDate = card.releasedAt
    ? formatReleaseDate(card.releasedAt)
    : null;
  const showImage = card.images !== null && !imageFailed;
  const collection = formatCollection(card.setName, card.setCode);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Fechar detalhes"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={typeId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.title}>
              {card.name}
            </h2>
            <p id={typeId} className={styles.subtitle}>
              {card.typeLine}
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Fechar"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>
        <div className={styles.body}>
          {showImage && card.images ? (
            <Image
              className={styles.image}
              src={card.images.normal}
              alt={`Ilustração de ${card.name}`}
              width={488}
              height={680}
              sizes="248px"
              priority
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
          <div>
            <dl className={styles.details}>
              <div className={styles.row}>
                {card.manaCost ? (
                  <div className={styles.cell}>
                    <dt>Custo de mana</dt>
                    <dd>
                      <ManaCost cost={card.manaCost} />
                    </dd>
                  </div>
                ) : null}
                <div className={styles.cell}>
                  <dt>Raridade</dt>
                  <dd>{rarityLabel(card.rarity)}</dd>
                </div>
              </div>
              <div className={styles.cell}>
                <dt>Tipo</dt>
                <dd>{card.typeLine}</dd>
              </div>
              {collection ? (
                <div className={styles.cell}>
                  <dt>Coleção</dt>
                  <dd>{collection}</dd>
                </div>
              ) : null}
              {releaseDate || card.artist ? (
                <div className={styles.row}>
                  {releaseDate ? (
                    <div className={styles.cell}>
                      <dt>Lançamento</dt>
                      <dd>{releaseDate}</dd>
                    </div>
                  ) : null}
                  {card.artist ? (
                    <div className={styles.cell}>
                      <dt>Artista</dt>
                      <dd>{card.artist}</dd>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {card.oracleText ? (
                <div className={styles.cell}>
                  <dt>Texto oracle</dt>
                  <dd className={styles.oracle}>{card.oracleText}</dd>
                </div>
              ) : null}
            </dl>
            <div className={styles.favoriteRow}>
              <FavoriteButton
                cardName={card.name}
                pressed={isFavorite}
                labeled
                onToggle={onToggleFavorite}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function formatCollection(setName: string, setCode: string): string | null {
  const code = setCode.trim().toUpperCase();

  if (setName.trim().length === 0 && code.length === 0) {
    return null;
  }

  if (setName.trim().length === 0) {
    return code;
  }

  if (code.length === 0) {
    return setName;
  }

  return `${setName} (${code})`;
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 3 L13 13 M13 3 L3 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
