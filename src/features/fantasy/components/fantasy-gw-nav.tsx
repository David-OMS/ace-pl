import { ChevronLeft, ChevronRight } from "lucide-react";

import { Icon } from "@/ui/icon";

import { fantasyCopy } from "../copy";

export type FantasyGwNavOption = {
  id: string | null;
  label: string;
};

type FantasyGwNavProps = {
  options: readonly FantasyGwNavOption[];
  selectedId: string | null;
  onSelect: (dayId: string | null) => void;
};

export function FantasyGwNav({
  options,
  selectedId,
  onSelect,
}: FantasyGwNavProps): React.JSX.Element | null {
  if (options.length === 0) return null;
  const index = Math.max(
    0,
    options.findIndex((option) => option.id === selectedId),
  );
  const current = options[index] ?? options[0];
  if (!current) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <NavArrow
        label={fantasyCopy.prevGameweek}
        disabled={index <= 0}
        onClick={() => {
          const prev = options[index - 1];
          if (prev) onSelect(prev.id);
        }}
      >
        <Icon icon={ChevronLeft} size="md" />
      </NavArrow>
      <p className="font-display text-lg uppercase tracking-wide">{current.label}</p>
      <NavArrow
        label={fantasyCopy.nextGameweek}
        disabled={index >= options.length - 1}
        onClick={() => {
          const next = options[index + 1];
          if (next) onSelect(next.id);
        }}
      >
        <Icon icon={ChevronRight} size="md" />
      </NavArrow>
    </div>
  );
}

function NavArrow(args: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <button
      type="button"
      aria-label={args.label}
      disabled={args.disabled}
      onClick={args.onClick}
      className="inline-flex size-10 items-center justify-center border-2 border-line bg-surface disabled:opacity-30"
    >
      {args.children}
    </button>
  );
}
