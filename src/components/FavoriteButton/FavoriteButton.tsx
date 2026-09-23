import type { MouseEvent } from "react";
import { StarIcon } from "@/components/icons/StarIcon";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  cardName: string;
  pressed: boolean;
  tone?: "light" | "dark";
  onToggle: () => void;
};

export function FavoriteButton({
  cardName,
  pressed,
  tone = "dark",
  onToggle,
}: FavoriteButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onToggle();
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-tone={tone}
      aria-pressed={pressed}
      aria-label={
        pressed
          ? `Remover ${cardName} dos favoritos`
          : `Salvar ${cardName} nos favoritos`
      }
      onClick={handleClick}
    >
      <StarIcon filled={pressed} />
    </button>
  );
}
