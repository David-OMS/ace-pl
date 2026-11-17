import { TeamCrest } from "@/ui/team-crest";
import { Card } from "@/ui/card";

import { standingsCopy } from "../copy";
import type { FormDisplayRow } from "../queries/get-tournament-form";
import { FormDots } from "./form-dots";

type StandingsFormProps = { rows: readonly FormDisplayRow[] };

export function StandingsForm({ rows }: StandingsFormProps): React.JSX.Element | null {
  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{standingsCopy.formTitle}</h2>
      <Card className="p-0">
        <ul>
          {rows.map((row) => (
            <li
              key={row.teamId}
              className="flex items-center gap-3 border-b border-line-soft px-3 py-2.5 last:border-b-0"
            >
              <TeamCrest name={row.teamName} color={row.teamColor} />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{row.teamName}</span>
              <FormDots results={row.results} teamId={row.teamId} />
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
