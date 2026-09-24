import styles from "./ErrorState.module.css";

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <section className={styles.panel} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Tentar novamente
      </button>
    </section>
  );
}
