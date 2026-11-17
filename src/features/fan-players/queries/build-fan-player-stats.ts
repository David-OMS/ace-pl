import type { PlayerPosition } from "@/config/player-positions";
import {
  topByMetric,
  type LeaderboardMetric,
  type PlayerStatTotals,
} from "@/features/leaderboards";
import { calculatePlayerFantasyPoints } from "../domain/calculate-player-fantasy-points";

export type FanPlayerStatSnapshot = {
  apps: number;
  goals: number;
  assists: number;
  motm: number;
  yellowCards: number;
  redCards: number;
  fantasyPoints: number;
};

export type FanLeaderboardRow = {
  playerId: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  value: number;
};

type PlayerMeta = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
};

const LEADERBOARD_METRICS: readonly LeaderboardMetric[] = [
  "goals",
  "assists",
  "cleanSheets",
  "saves",
  "motm",
  "yellowCards",
  "redCards",
];

const TOP_N = 10;

export function buildPlayerStatSnapshot(
  position: PlayerPosition,
  row: PlayerStatTotals | undefined,
  goalsConceded: number,
): FanPlayerStatSnapshot {
  const base: PlayerStatTotals = row ?? emptyTotals("");
  const fantasyPoints = calculatePlayerFantasyPoints(position, {
    apps: base.apps,
    goals: base.goals,
    assists: base.assists,
    cleanSheets: base.cleanSheets,
    yellowCards: base.yellowCards,
    redCards: base.redCards,
    saves: base.saves,
    motm: base.motm,
    ownGoals: base.ownGoals,
    penaltySaves: base.penaltySaves,
    goalsConceded,
  });
  return {
    apps: base.apps,
    goals: base.goals,
    assists: base.assists,
    motm: base.motm,
    yellowCards: base.yellowCards,
    redCards: base.redCards,
    fantasyPoints,
  };
}

export function buildLeaderboardBoards(
  totals: readonly PlayerStatTotals[],
  players: readonly PlayerMeta[],
): Record<LeaderboardMetric, FanLeaderboardRow[]> {
  const byId = new Map(players.map((p) => [p.id, p]));
  const boards = {} as Record<LeaderboardMetric, FanLeaderboardRow[]>;
  for (const metric of LEADERBOARD_METRICS) {
    boards[metric] = topByMetric(totals, metric, TOP_N).map((row) => {
      const player = byId.get(row.playerId);
      return {
        playerId: row.playerId,
        name: player?.name ?? "?",
        position: player?.position ?? "MID",
        photoUrl: player?.photoUrl ?? null,
        value: row[metric],
      };
    });
  }
  return boards;
}

function emptyTotals(playerId: string): PlayerStatTotals {
  return {
    playerId,
    apps: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
    saves: 0,
    motm: 0,
    ownGoals: 0,
    penaltySaves: 0,
  };
}
