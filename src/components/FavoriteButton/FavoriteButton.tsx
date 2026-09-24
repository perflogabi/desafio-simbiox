import type { MouseEvent } from "react";
import { StarIcon } from "@/components/icons/StarIcon";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  cardName: string;
  pressed: boolean;
  tone?: "light" | "dark";
  labeled?: boolean;
  onToggle: () => void;
};

export function FavoriteButton({
  cardName,
  pressed,
  tone = "dark",
  labeled = false,
  onToggle,
}: FavoriteButtonProps) {
  function favoriteLabel(
    labeled: boolean,
    pressed: boolean,
    cardName: string,
  ): string | undefined {
    if (labeled) {
      return undefined;
    }

    if (pressed) {
      return `Remover ${cardName} dos favoritos`;
    }

    return `Salvar ${cardName} nos favoritos`;
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onToggle();
  }

  return (
    <button
      type="button"
      className={labeled ? `${styles.button} ${styles.labeled}` : styles.button}
      data-tone={tone}
      aria-pressed={pressed}
      aria-label={favoriteLabel(labeled, pressed, cardName)}
      onClick={handleClick}
    >
      {labeled ? (
        <span>
          {pressed ? "Remover dos favoritos" : "Salvar nos favoritos"}
        </span>
      ) : null}
      <StarIcon filled={pressed} />
    </button>
  );
}
