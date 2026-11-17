import Link from "next/link";

import { FAN_LEAGUE_PATH } from "@/features/fan";

import type { StandingsTournamentChip } from "../queries/list-standings-tournaments";

type StandingsTournamentChipsProps = {
  tournaments: readonly StandingsTournamentChip[];
  selectedId: string | null;
};

/** Only render when there is more than one tournament to switch between. */
export function StandingsTournamentChips({
  tournaments,
  selectedId,
}: StandingsTournamentChipsProps): React.JSX.Element | null {
  if (tournaments.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-1 pb-1">
      {tournaments.map((tournament) => {
        const active = tournament.id === selectedId;
        return (
          <Link
            key={tournament.id}
            href={`${FAN_LEAGUE_PATH}?tournament=${tournament.id}`}
            className={`shrink-0 border-2 px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase ${
              active
                ? "border-line bg-accent text-on-accent"
                : "border-line-soft bg-surface text-muted"
            }`}
          >
            {tournament.name}
          </Link>
        );
      })}
    </div>
  );
}
