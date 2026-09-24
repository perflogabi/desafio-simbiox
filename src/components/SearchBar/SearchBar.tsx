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
      <div className={styles.field}>
        <SearchIcon />
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
      </div>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="7"
        cy="7"
        r="4.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10.4 10.4 L13.2 13.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
