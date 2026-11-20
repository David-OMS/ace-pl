import type { PlayerPosition } from "@/config/player-positions";
import type { MatchEventType } from "@/config/match-events";

import { calculatePlayerFantasyPoints } from "../domain/calculate-player-fantasy-points";
import { assembleStatTotals } from "./assemble-stat-totals";

type ParticipationRow = {
  player_id: string;
  status: "played" | "unused_sub" | "absent";
  team_id: string;
  fixture_id: string;
  position: string | null;
  is_goalkeeper: boolean;
};

type EventRow = {
  event_type: MatchEventType;
  player_id: string;
  quantity: number;
  assist_player_id: string | null;
  fixture_id: string;
};

type FixtureRow = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  status: string;
  walkover_winner_team_id: string | null;
};

/** Fantasy points: score every fixture alone, then sum (GW or season). */
export function scoreFantasyPointsPerMatch(args: {
  positionByPlayerId: ReadonlyMap<string, PlayerPosition>;
  participations: readonly ParticipationRow[];
  events: readonly EventRow[];
  fixtures: readonly FixtureRow[];
}): Map<string, number> {
  const points = new Map<string, number>();
  for (const fixture of args.fixtures) {
    addFixturePoints(points, args, fixture);
  }
  return points;
}

function addFixturePoints(
  points: Map<string, number>,
  args: {
    positionByPlayerId: ReadonlyMap<string, PlayerPosition>;
    participations: readonly ParticipationRow[];
    events: readonly EventRow[];
  },
  fixture: FixtureRow,
): void {
  const assembled = assembleStatTotals(
    args.participations.filter((row) => row.fixture_id === fixture.id),
    args.events.filter((row) => row.fixture_id === fixture.id),
    { fixtures: [fixture] },
  );
  for (const total of assembled.totals) {
    const position = args.positionByPlayerId.get(total.playerId) ?? "MID";
    const matchPoints = calculatePlayerFantasyPoints(position, {
      ...total,
      cleanSheets: assembled.fantasyCleanSheets.get(total.playerId) ?? 0,
      goalsConceded: assembled.goalsConceded.get(total.playerId) ?? 0,
    });
    points.set(total.playerId, (points.get(total.playerId) ?? 0) + matchPoints);
  }
}
