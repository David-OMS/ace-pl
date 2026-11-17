import Link from "next/link";
import type { Route } from "next";

import { fantasyCopy } from "../copy";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";

type FantasyGwChipsProps = {
  days: readonly FantasyGameDayOption[];
  selectedId: string | null;
  hrefFor: (dayId: string | null) => Route;
};

export function FantasyGwChips({
  days,
  selectedId,
  hrefFor,
}: FantasyGwChipsProps): React.JSX.Element {
  if (days.length === 0) return <></>;

  return (
    <div className="flex flex-wrap gap-2">
      <ChipLink
        href={hrefFor(null)}
        active={selectedId === null}
        label={fantasyCopy.gameweekLive}
      />
      {days.map((day) => (
        <ChipLink
          key={day.id}
          href={hrefFor(day.id)}
          active={selectedId === day.id}
          label={day.label}
        />
      ))}
    </div>
  );
}

function ChipLink({
  href,
  active,
  label,
}: {
  href: Route;
  active: boolean;
  label: string;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className={`rounded-card border-2 px-3 py-1 text-xs font-bold uppercase ${
        active ? "border-line bg-accent text-on-accent" : "border-line-soft bg-surface text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
