import type { PlayerPosition } from "@/config/player-positions";
import type { MatchEventType } from "@/config/match-events";
import {
  aggregatePlayerStats,
  countAssistsFromEvents,
  countCleanSheets,
  countFantasyCleanSheets,
  filterCompletedMatchScope,
  mergeStatExtras,
  type PlayerStatTotals,
} from "@/features/leaderboards";
import { buildStandingFixtures } from "@/features/standings";
import { countGoalsConceded } from "../domain/count-goals-conceded";
import { scoreFantasyPointsPerMatch } from "./score-fantasy-points-per-match";

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

export type AssembledStats = {
  totals: PlayerStatTotals[];
  goalsConceded: Map<string, number>;
  /** Includes MID; stats boards use totals.cleanSheets (GK/DEF only). */
  fantasyCleanSheets: Map<string, number>;
  /** Per-match fantasy score summed (saves / conceded pairs floored each match). */
  fantasyPoints: Map<string, number>;
};

export function assembleStatTotals(
  participations: readonly ParticipationRow[],
  events: readonly EventRow[],
  args: {
    fixtures: readonly FixtureRow[];
    positionByPlayerId?: ReadonlyMap<string, PlayerPosition>;
  },
): AssembledStats {
  const scope = filterCompletedMatchScope({
    participations,
    events,
    fixtures: args.fixtures,
  });
  const positionByPlayerId = args.positionByPlayerId ?? new Map<string, PlayerPosition>();
  const core = buildCoreStats(scope);
  const fantasyPoints =
    positionByPlayerId.size > 0
      ? scoreFantasyPointsPerMatch({
          positionByPlayerId,
          participations: scope.participations,
          events: scope.events,
          fixtures: scope.fixtures,
        })
      : new Map<string, number>();
  return { ...core, fantasyPoints };
}

function buildCoreStats(scope: {
  participations: readonly ParticipationRow[];
  events: readonly EventRow[];
  fixtures: readonly FixtureRow[];
}): Omit<AssembledStats, "fantasyPoints"> {
  const appearanceMeta = scope.participations.map((a) => ({
    fixtureId: a.fixture_id,
    playerId: a.player_id,
    teamId: a.team_id,
    status: a.status,
    position: a.position as PlayerPosition | null,
    isGoalkeeper: a.is_goalkeeper,
  }));
  const fixtureMeta = buildFixtureMeta(scope.fixtures, scope.events, scope.participations);
  return {
    totals: mergeStatExtras(
      aggregatePlayerStats(
        scope.participations.map((row) => ({ playerId: row.player_id, status: row.status })),
        scope.events.map((row) => ({
          eventType: row.event_type,
          playerId: row.player_id,
          quantity: row.quantity,
        })),
      ),
      countAssistsFromEvents(
        scope.events.map((row) => ({ assistPlayerId: row.assist_player_id })),
      ),
      countCleanSheets(fixtureMeta, appearanceMeta),
    ),
    goalsConceded: countGoalsConceded(fixtureMeta, appearanceMeta),
    fantasyCleanSheets: countFantasyCleanSheets(fixtureMeta, appearanceMeta),
  };
}

function buildFixtureMeta(
  fixtures: readonly FixtureRow[],
  events: readonly EventRow[],
  participations: readonly ParticipationRow[],
) {
  const standingFixtures = buildStandingFixtures(
    fixtures,
    events.map((e) => ({
      fixture_id: e.fixture_id,
      event_type: e.event_type,
      player_id: e.player_id,
    })),
    participations.map((a) => ({
      fixture_id: a.fixture_id,
      player_id: a.player_id,
      team_id: a.team_id,
    })),
  );
  return fixtures.map((f, i) => ({
    fixtureId: f.id,
    homeTeamId: f.home_team_id,
    awayTeamId: f.away_team_id,
    homeGoals: standingFixtures[i]?.homeGoals ?? 0,
    awayGoals: standingFixtures[i]?.awayGoals ?? 0,
    status: f.status,
  }));
}
