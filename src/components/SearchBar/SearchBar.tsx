"use client";

import { useId, type FormEvent } from "react";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchBar({ value, onValueChange }: SearchBarProps) {
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <label className="visuallyHidden" htmlFor={inputId}>
        Buscar cartas
      </label>
      <input
        id={inputId}
        className={styles.input}
        name="q"
        type="search"
        placeholder="Buscar cartas..."
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
      />
    </form>
  );
}
