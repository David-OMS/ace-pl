"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

import { Icon } from "./icon";
import { SelectOptionsList } from "./select-options-list";
import { useDismissible } from "./use-dismissible";

export type SelectOption = { value: string; label: string };

export type SelectControlProps = {
  id: string;
  name?: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  labelledBy?: string;
};

export function SelectControl({
  id,
  name,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = "Select",
  labelledBy,
}: SelectControlProps): React.JSX.Element {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const dismiss = useCallback(() => setIsOpen(false), []);
  useDismissible(isOpen, rootRef, dismiss);

  return (
    <div ref={rootRef} className="relative">
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-card border-2 border-line bg-surface px-3 text-left text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected ? "" : "text-muted"}>{selected?.label ?? placeholder}</span>
        <Icon icon={ChevronDown} size="sm" />
      </button>
      {isOpen ? (
        <SelectOptionsList
          id={listId}
          {...(labelledBy !== undefined ? { labelledBy } : {})}
          options={options}
          value={value}
          onSelect={(next) => {
            onChange(next);
            setIsOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
