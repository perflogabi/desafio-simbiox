import styles from "./ManaCost.module.css";

type ManaCostProps = {
  cost: string;
};

export function ManaCost({ cost }: ManaCostProps) {
  const symbols = [...cost.matchAll(/\{([^}]+)\}/g)]
    .map((match) => match[1])
    .filter(
      (symbol): symbol is string => symbol !== undefined && symbol !== "",
    );

  if (symbols.length === 0) {
    return null;
  }

  return (
    <span
      className={styles.cost}
      aria-label={`Custo de mana ${symbols.join(" ")}`}
    >
      {symbols.map((symbol, index) => (
        <span
          key={`${symbol}-${index}`}
          className={`${styles.pip} ${pipClass(symbol)}`}
          aria-hidden="true"
        >
          {symbol}
        </span>
      ))}
    </span>
  );
}

function pipClass(symbol: string): string {
  switch (symbol) {
    case "W":
      return styles.white;
    case "U":
      return styles.blue;
    case "B":
      return styles.black;
    case "R":
      return styles.red;
    case "G":
      return styles.green;
    default:
      return styles.generic;
  }
}
