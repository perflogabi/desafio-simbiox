"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "@/components/CardModal/useDialog";
import type { AppliedFilters } from "@/lib/urlFilters";
import {
  SEARCH_RARITIES,
  SEARCH_TYPES,
  type SearchRarity,
  type SearchType,
} from "@/types/card";
import styles from "./FilterBar.module.css";

const RARITY_LABELS: Record<SearchRarity, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Rara",
  mythic: "Mítica",
};

const TYPE_LABELS: Record<SearchType, string> = {
  creature: "Criatura",
  artifact: "Artefato",
  enchantment: "Encantamento",
  sorcery: "Feitiço",
  instant: "Mágica Instantânea",
  planeswalker: "Planeswalker",
  land: "Terreno",
};

type DraftFilters = {
  rarity: SearchRarity | null;
  type: SearchType | null;
};

type FilterBarProps = {
  applied: AppliedFilters;
  onApply: (draft: DraftFilters) => void;
  onClear: () => void;
  onRemove: (kind: "rarity" | "type") => void;
};

type Anchor = {
  top: number;
  right: number;
};

export function FilterBar({
  applied,
  onApply,
  onClear,
  onRemove,
}: FilterBarProps) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [draft, setDraft] = useState<DraftFilters>({
    rarity: applied.rarity,
    type: applied.type,
  });
  const activeCount = countActive(applied);

  function openPanel() {
    const rect = buttonRef.current?.getBoundingClientRect();
    setDraft({ rarity: applied.rarity, type: applied.type });
    const media = window.matchMedia?.("(max-width: 719px)");
    setMobile(media?.matches ?? false);
    setAnchor(
      rect
        ? {
            top: rect.bottom + 8,
            right: Math.max(12, window.innerWidth - rect.right),
          }
        : null,
    );
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
  }

  return (
    <div className={styles.bar}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        data-active={activeCount > 0}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (open) {
            closePanel();
          } else {
            openPanel();
          }
        }}
      >
        <FilterIcon />
        Filtros
        {activeCount > 0 ? (
          <span className={styles.badge}>{` • ${activeCount}`}</span>
        ) : null}
      </button>
      {applied.rarity || applied.type ? (
        <ul className={styles.chips}>
          {applied.rarity ? (
            <li>
              <Chip
                label={RARITY_LABELS[applied.rarity]}
                onRemove={() => {
                  onRemove("rarity");
                }}
              />
            </li>
          ) : null}
          {applied.type ? (
            <li>
              <Chip
                label={TYPE_LABELS[applied.type]}
                onRemove={() => {
                  onRemove("type");
                }}
              />
            </li>
          ) : null}
        </ul>
      ) : null}
      {open ? (
        <FilterPanel
          id={panelId}
          mobile={mobile}
          anchor={anchor}
          draft={draft}
          clearDisabled={draft.rarity === null && draft.type === null}
          onDraftChange={setDraft}
          onApply={() => {
            onApply(draft);
            closePanel();
          }}
          onClear={() => {
            onClear();
            closePanel();
          }}
          onClose={closePanel}
        />
      ) : null}
    </div>
  );
}

type FilterPanelProps = {
  id: string;
  mobile: boolean;
  anchor: Anchor | null;
  draft: DraftFilters;
  clearDisabled: boolean;
  onDraftChange: (draft: DraftFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

function FilterPanel({
  id,
  mobile,
  anchor,
  draft,
  clearDisabled,
  onDraftChange,
  onApply,
  onClear,
  onClose,
}: FilterPanelProps) {
  const titleId = useId();
  const dialogRef = useDialog(onClose);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={mobile ? styles.sheetRoot : styles.popoverRoot}>
      <button
        type="button"
        className={mobile ? styles.sheetBackdrop : styles.popoverBackdrop}
        aria-label="Fechar filtros"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        id={id}
        className={mobile ? styles.sheet : styles.popover}
        style={
          mobile || anchor === null
            ? undefined
            : { top: anchor.top, right: anchor.right }
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.heading}>
            Filtros
          </h2>
          {mobile ? (
            <button
              type="button"
              className={styles.close}
              aria-label="Fechar"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          ) : null}
        </header>
        <div className={styles.body}>
          <fieldset className={styles.group}>
            <legend className={styles.legend}>Raridade</legend>
            <div className={styles.options}>
              <Option
                name="rarity"
                label="Todas"
                checked={draft.rarity === null}
                onSelect={() => {
                  onDraftChange({ ...draft, rarity: null });
                }}
              />
              {SEARCH_RARITIES.map((rarity) => (
                <Option
                  key={rarity}
                  name="rarity"
                  label={RARITY_LABELS[rarity]}
                  checked={draft.rarity === rarity}
                  onSelect={() => {
                    onDraftChange({ ...draft, rarity });
                  }}
                />
              ))}
            </div>
          </fieldset>
          <TypeSelect
            value={draft.type}
            onChange={(type) => {
              onDraftChange({ ...draft, type });
            }}
          />
        </div>
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.clear}
            disabled={clearDisabled}
            onClick={onClear}
          >
            Limpar
          </button>
          <button type="button" className={styles.apply} onClick={onApply}>
            Aplicar
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function Option({
  name,
  label,
  checked,
  onSelect,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className={styles.option}>
      <input type="radio" name={name} checked={checked} onChange={onSelect} />
      {label}
    </label>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      className={styles.chip}
      aria-label={`Remover filtro ${label}`}
      onClick={onRemove}
    >
      {label}
      <span aria-hidden="true">×</span>
    </button>
  );
}

function TypeSelect({
  value,
  onChange,
}: {
  value: SearchType | null;
  onChange: (type: SearchType | null) => void;
}) {
  const labelId = useId();
  const valueId = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const selected = value ? TYPE_LABELS[value] : "Todos";

  return (
    <div
      className={styles.typeField}
      onKeyDown={(event) => {
        if (!open || event.key !== "Escape") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }}
    >
      <span id={labelId} className={styles.legend}>
        Tipo
      </span>
      <button
        type="button"
        className={styles.select}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${valueId}`}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span id={valueId}>{selected}</span>
        <ChevronIcon />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={styles.typeList}
        >
          <TypeOption
            label="Todos"
            selected={value === null}
            onSelect={() => {
              onChange(null);
              setOpen(false);
            }}
          />
          {SEARCH_TYPES.map((type) => (
            <TypeOption
              key={type}
              label={TYPE_LABELS[type]}
              selected={value === type}
              onSelect={() => {
                onChange(type);
                setOpen(false);
              }}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function TypeOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li role="presentation">
      <button
        type="button"
        role="option"
        className={styles.typeOption}
        aria-selected={selected}
        onClick={onSelect}
      >
        {label}
      </button>
    </li>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 6 L8 10.5 L12.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function countActive(applied: AppliedFilters): number {
  return (applied.rarity ? 1 : 0) + (applied.type ? 1 : 0);
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 3.5h12M4.5 8h7M7 12.5h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
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
