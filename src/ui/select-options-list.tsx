"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { filterSelectOptions } from "./filter-select-options";
import { Icon } from "./icon";
import type { SelectOption } from "./select-control";

type SelectOptionsListProps = {
  id: string;
  labelledBy?: string;
  options: readonly SelectOption[];
  value: string;
  onSelect: (value: string) => void;
  searchPlaceholder?: string;
  emptyLabel?: string;
};

// eslint-disable-next-line max-lines-per-function -- select list chrome
export function SelectOptionsList({
  id,
  labelledBy,
  options,
  value,
  onSelect,
  searchPlaceholder = "Search",
  emptyLabel = "No matches",
}: SelectOptionsListProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => filterSelectOptions(options, query), [options, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-card border-2 border-line bg-surface shadow-offset">
      <div className="border-b border-line-soft p-2">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // Keep Enter from submitting a parent form while picking.
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder={searchPlaceholder}
          aria-controls={id}
          className="min-h-10 w-full border-2 border-line bg-canvas px-2 text-sm font-semibold text-ink outline-none"
        />
      </div>
      <ul id={id} role="listbox" aria-labelledby={labelledBy} className="max-h-52 overflow-auto">
        {filtered.length === 0 ? (
          <li className="px-3 py-3 text-sm text-muted">{emptyLabel}</li>
        ) : (
          filtered.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left text-sm font-bold ${isSelected ? "bg-accent text-on-accent" : "text-ink hover:bg-surface-alt"}`}
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                  {isSelected ? <Icon icon={Check} size="sm" /> : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
