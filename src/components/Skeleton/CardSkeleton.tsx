import styles from "./Skeleton.module.css";

const PLACEHOLDERS = ["a", "b", "c", "d", "e", "f"] as const;

export function CardSkeletonGrid() {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {PLACEHOLDERS.map((item) => (
        <li key={item}>
          <div className={styles.card}>
            <div className={styles.image} />
            <div className={styles.favorite} />
          </div>
        </li>
      ))}
    </ul>
  );
}
