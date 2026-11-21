import { SoftNavLink } from "@/ui/soft-nav-link";
import { TeamCrest } from "@/ui/team-crest";

import { standingsCopy } from "../copy";
import type { StandingTeamRow } from "../queries/get-tournament-standings";
import { standingsTeamPath } from "../routes";

type StandingsTableProps = { rows: readonly StandingTeamRow[] };

export function StandingsTable({ rows }: StandingsTableProps): React.JSX.Element {
  const cols = standingsCopy.columns;
  if (rows.length === 0) {
    return <p className="text-sm text-muted">{standingsCopy.empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-line text-left text-xs font-bold tracking-wider text-muted uppercase">
            <th className="px-2 py-3">{cols.pos}</th>
            <th className="px-2 py-3">{cols.team}</th>
            <th className="px-2 py-3 text-center">{cols.played}</th>
            <th className="px-2 py-3 text-center">{cols.won}</th>
            <th className="px-2 py-3 text-center">{cols.drawn}</th>
            <th className="px-2 py-3 text-center">{cols.lost}</th>
            <th className="px-2 py-3 text-center">{cols.goalsFor}</th>
            <th className="px-2 py-3 text-center">{cols.goalsAgainst}</th>
            <th className="px-2 py-3 text-center">{cols.goalDifference}</th>
            <th className="px-2 py-3 text-center">{cols.points}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <StandingRow key={row.teamId} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StandingRow({ row }: { row: StandingTeamRow }): React.JSX.Element {
  return (
    <tr className="relative border-b border-line-soft last:border-b-0">
      <td className="px-2 py-3 font-bold">
        <SoftNavLink
          href={standingsTeamPath(row.teamId)}
          className="absolute inset-0 z-[1]"
          aria-label={row.teamName}
        >
          <span className="sr-only">{row.teamName}</span>
        </SoftNavLink>
        {row.position}
      </td>
      <td className="px-2 py-3">
        <span className="inline-flex items-center gap-2 font-bold">
          <TeamCrest name={row.teamName} color={row.teamColor} />
          {row.teamName}
        </span>
      </td>
      <td className="px-2 py-3 text-center">{row.played}</td>
      <td className="px-2 py-3 text-center">{row.won}</td>
      <td className="px-2 py-3 text-center">{row.drawn}</td>
      <td className="px-2 py-3 text-center">{row.lost}</td>
      <td className="px-2 py-3 text-center">{row.goalsFor}</td>
      <td className="px-2 py-3 text-center">{row.goalsAgainst}</td>
      <td className="px-2 py-3 text-center">{formatGd(row.goalDifference)}</td>
      <td className="px-2 py-3 text-center font-bold">{row.points}</td>
    </tr>
  );
}

function formatGd(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}
