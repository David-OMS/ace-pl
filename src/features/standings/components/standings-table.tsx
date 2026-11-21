import { standingsCopy } from "../copy";
import type { StandingTeamRow } from "../queries/get-tournament-standings";
import { StandingRow } from "./standing-row";

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
