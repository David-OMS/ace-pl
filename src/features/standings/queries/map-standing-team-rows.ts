import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";

import type { StandingRow } from "../domain/calculate-standings";
import type { StandingTeamRow } from "./get-tournament-standings";

type TeamRow = { id: string; name: string; color: string };

export function mapStandingTeamRows(
  standings: readonly StandingRow[],
  teams: readonly TeamRow[],
): StandingTeamRow[] {
  const teamById = new Map(teams.map((t) => [t.id, t]));
  return standings.map((row, index) => {
    const team = teamById.get(row.teamId);
    return {
      ...row,
      teamName: team?.name ?? "?",
      teamColor: team?.color ?? DEFAULT_TEAM_COLOR,
      position: index + 1,
    };
  });
}
