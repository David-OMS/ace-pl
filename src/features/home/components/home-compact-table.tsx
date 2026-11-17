import Link from "next/link";

import { FAN_LEAGUE_PATH } from "@/features/fan";
import { FormDots, formatGoalDifference, standingsCopy } from "@/features/standings";
import { Card } from "@/ui/card";
import { TeamCrest } from "@/ui/team-crest";

import { homeCopy } from "../copy";
import type { HomeTableRow } from "../queries/get-home-snapshot";

type HomeCompactTableProps = { rows: readonly HomeTableRow[] };

export function HomeCompactTable({ rows }: HomeCompactTableProps): React.JSX.Element | null {
  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{homeCopy.table}</h2>
        <Link href={FAN_LEAGUE_PATH} className="text-xs font-bold text-muted">
          {homeCopy.fullTable}
        </Link>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_1.5rem_2rem_2rem_3.5rem] items-center gap-1 border-b border-line-soft px-3 py-2 text-[10px] font-extrabold tracking-wide text-muted uppercase">
          <span>{standingsCopy.columns.pos}</span>
          <span>{standingsCopy.columns.team}</span>
          <span className="text-center">{standingsCopy.columns.played}</span>
          <span className="text-center">{standingsCopy.columns.goalDifference}</span>
          <span className="text-center">{standingsCopy.columns.points}</span>
          <span className="text-right">{homeCopy.form}</span>
        </div>
        <ul>
          {rows.map((row) => (
            <li
              key={row.teamId}
              className="grid grid-cols-[1.25rem_minmax(0,1fr)_1.5rem_2rem_2rem_3.5rem] items-center gap-1 border-b border-line-soft px-3 py-2.5 last:border-b-0"
            >
              <span className="text-sm font-bold text-muted">{row.position}</span>
              <span className="flex min-w-0 items-center gap-2">
                <TeamCrest name={row.teamName} color={row.teamColor} />
                <span className="truncate text-sm font-bold">{row.teamName}</span>
              </span>
              <span className="text-center text-sm font-bold">{row.played}</span>
              <span className="text-center text-sm font-bold">
                {formatGoalDifference(row.goalDifference)}
              </span>
              <span className="text-center font-display text-lg">{row.points}</span>
              <span className="flex justify-end">
                <FormDots results={row.form} teamId={row.teamId} />
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
