import type { PlayerPosition } from "@/config/player-positions";
import {
  aggregatePlayerStats,
  countAssistsFromEvents,
  countCleanSheets,
  mergeStatExtras,
  topByMetric,
  type LeaderboardMetric,
  type PlayerStatTotals,
} from "@/features/leaderboards";
import { buildStandingFixtures } from "@/features/standings";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";

import type { HomeStatBoard, HomeStatEntry } from "./home-stat-types";

const HOME_METRICS: readonly LeaderboardMetric[] = [
  "goals",
  "assists",
  "cleanSheets",
  "yellowCards",
  "redCards",
];

const TOP_N = 3;

type AppearanceDb = {
  player_id: string;
  status: "played" | "unused_sub" | "absent";
  team_id: string;
  fixture_id: string;
  position: PlayerPosition | null;
  is_goalkeeper: boolean;
};

type EventDb = {
  event_type: Parameters<typeof aggregatePlayerStats>[1][number]["eventType"];
  player_id: string;
  quantity: number;
  assist_player_id: string | null;
  fixture_id: string;
};

type FixtureDb = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  status: string;
  walkover_winner_team_id: string | null;
};

type PlayerDb = {
  id: string;
  name: string;
  position: PlayerPosition;
  photo_path: string | null;
};

export function buildHomeStatBoards(input: {
  appearances: readonly AppearanceDb[];
  events: readonly EventDb[];
  fixtures: readonly FixtureDb[];
  players: readonly PlayerDb[];
}): HomeStatBoard[] {
  const positionById = new Map(input.players.map((p) => [p.id, p.position]));
  const appearances = input.appearances.map((row) => ({
    ...row,
    position: row.position ?? positionById.get(row.player_id) ?? null,
  }));
  const totals = buildTotals({ ...input, appearances });
  const playerById = new Map(input.players.map((p) => [p.id, p]));
  return HOME_METRICS.map((metric) => ({
    metric,
    entries: mapEntries(topByMetric(totals, metric, TOP_N), metric, playerById),
  }));
}

function buildTotals(input: {
  appearances: readonly AppearanceDb[];
  events: readonly EventDb[];
  fixtures: readonly FixtureDb[];
}): PlayerStatTotals[] {
  const cleanSheets = cleanSheetsFor(input);
  return mergeStatExtras(
    aggregatePlayerStats(
      input.appearances.map((row) => ({
        playerId: row.player_id,
        status: row.status,
      })),
      input.events.map((row) => ({
        eventType: row.event_type,
        playerId: row.player_id,
        quantity: row.quantity,
      })),
    ),
    countAssistsFromEvents(input.events.map((row) => ({ assistPlayerId: row.assist_player_id }))),
    cleanSheets,
  );
}

function cleanSheetsFor(input: {
  appearances: readonly AppearanceDb[];
  events: readonly EventDb[];
  fixtures: readonly FixtureDb[];
}): Map<string, number> {
  const standingFixtures = buildStandingFixtures(
    input.fixtures,
    input.events.map((e) => ({
      fixture_id: e.fixture_id,
      event_type: e.event_type,
      player_id: e.player_id,
    })),
    input.appearances.map((a) => ({
      fixture_id: a.fixture_id,
      player_id: a.player_id,
      team_id: a.team_id,
    })),
  );
  return countCleanSheets(
    input.fixtures.map((f, i) => ({
      fixtureId: f.id,
      homeTeamId: f.home_team_id,
      awayTeamId: f.away_team_id,
      homeGoals: standingFixtures[i]?.homeGoals ?? 0,
      awayGoals: standingFixtures[i]?.awayGoals ?? 0,
      status: f.status,
    })),
    input.appearances.map((a) => ({
      fixtureId: a.fixture_id,
      playerId: a.player_id,
      teamId: a.team_id,
      status: a.status,
      position: a.position,
      isGoalkeeper: a.is_goalkeeper,
    })),
  );
}

function mapEntries(
  rows: PlayerStatTotals[],
  metric: LeaderboardMetric,
  playerById: Map<string, PlayerDb>,
): HomeStatEntry[] {
  return rows.map((row) => {
    const player = playerById.get(row.playerId);
    return {
      playerId: row.playerId,
      name: player?.name ?? "?",
      position: player?.position ?? "MID",
      photoUrl: playerPhotoUrl(player?.photo_path),
      value: row[metric],
    };
  });
}
