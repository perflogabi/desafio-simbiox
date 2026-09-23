import { DiamondIcon } from "@/components/icons/DiamondIcon";
import type { CardColorFilter } from "@/types/card";
import styles from "./ColorFilter.module.css";

const COLOR_OPTIONS = [
  { value: "W", label: "Branco", letter: "W", pip: styles.white },
  { value: "U", label: "Azul", letter: "U", pip: styles.blue },
  { value: "B", label: "Preto", letter: "B", pip: styles.black },
  { value: "R", label: "Vermelho", letter: "R", pip: styles.red },
  { value: "G", label: "Verde", letter: "G", pip: styles.green },
  {
    value: "colorless",
    label: "Incolor",
    letter: null,
    pip: styles.colorless,
  },
] as const satisfies readonly {
  value: CardColorFilter;
  label: string;
  letter: string | null;
  pip: string;
}[];

type ColorFilterProps = {
  value: CardColorFilter | null;
  onChange: (value: CardColorFilter | null) => void;
};

export function ColorFilter({ value, onChange }: ColorFilterProps) {
  return (
    <fieldset className={styles.filter}>
      <legend className={styles.legend}>Cor</legend>
      <div className={styles.options}>
        {COLOR_OPTIONS.map((option) => {
          const pressed = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              aria-pressed={pressed}
              aria-label={option.label}
              onClick={() => {
                onChange(pressed ? null : option.value);
              }}
            >
              <span className={`${styles.pip} ${option.pip}`}>
                {option.letter ?? <DiamondIcon size={8} />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
