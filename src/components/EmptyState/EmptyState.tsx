import type { ReactNode } from "react";
import { DiamondIcon } from "@/components/icons/DiamondIcon";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className={styles.panel}>
      <DiamondIcon />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action}
    </section>
  );
}
