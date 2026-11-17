import type { Route } from "next";

import { SoftNavLink } from "@/ui/soft-nav-link";

import { fantasyCopy } from "../copy";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";

type FantasyGwChipsProps = {
  days: readonly FantasyGameDayOption[];
  selectedId: string | null;
  hrefFor?: (dayId: string | null) => Route;
  onSelect?: (dayId: string | null) => void;
};

export function FantasyGwChips({
  days,
  selectedId,
  hrefFor,
  onSelect,
}: FantasyGwChipsProps): React.JSX.Element {
  if (days.length === 0) return <></>;

  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        {...chipActions(null, hrefFor, onSelect)}
        active={selectedId === null}
        label={fantasyCopy.gameweekLive}
      />
      {days.map((day) => (
        <Chip
          key={day.id}
          {...chipActions(day.id, hrefFor, onSelect)}
          active={selectedId === day.id}
          label={day.label}
        />
      ))}
    </div>
  );
}

function chipActions(
  dayId: string | null,
  hrefFor: FantasyGwChipsProps["hrefFor"],
  onSelect: FantasyGwChipsProps["onSelect"],
): { href?: Route; onSelect?: () => void } {
  return {
    ...(hrefFor ? { href: hrefFor(dayId) } : {}),
    ...(onSelect ? { onSelect: () => onSelect(dayId) } : {}),
  };
}

function Chip({
  href,
  onSelect,
  active,
  label,
}: {
  href?: Route;
  onSelect?: () => void;
  active: boolean;
  label: string;
}): React.JSX.Element {
  const className = `rounded-card border-2 px-3 py-1 text-xs font-bold uppercase ${
    active ? "border-line bg-accent text-on-accent" : "border-line-soft bg-surface text-muted"
  }`;
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {label}
      </button>
    );
  }
  if (!href) return <span className={className}>{label}</span>;
  return (
    <SoftNavLink href={href} className={className}>
      {label}
    </SoftNavLink>
  );
}
