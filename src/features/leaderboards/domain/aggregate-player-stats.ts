import type { MatchEventType } from "@/config/match-events";

export type StatEvent = {
  eventType: MatchEventType;
  playerId: string;
  quantity: number;
};

export type AppearanceRow = {
  playerId: string;
  status: "played" | "unused_sub" | "absent";
};

export type PlayerStatTotals = {
  playerId: string;
  apps: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  saves: number;
  motm: number;
  ownGoals: number;
  penaltySaves: number;
};

/** Pure totals from participations + match events (one tournament or all). */
export function aggregatePlayerStats(
  appearances: readonly AppearanceRow[],
  events: readonly StatEvent[],
): PlayerStatTotals[] {
  const byId = new Map<string, PlayerStatTotals>();

  function row(playerId: string): PlayerStatTotals {
    const existing = byId.get(playerId);
    if (existing) return existing;
    const created: PlayerStatTotals = {
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
    byId.set(playerId, created);
    return created;
  }

  for (const appearance of appearances) {
    if (appearance.status !== "played") continue;
    row(appearance.playerId).apps += 1;
  }

  for (const event of events) {
    const totals = row(event.playerId);
    applyEvent(totals, event.eventType, event.quantity);
  }

  return [...byId.values()];
}

function applyEvent(totals: PlayerStatTotals, type: MatchEventType, quantity: number): void {
  switch (type) {
    case "goal":
      totals.goals += quantity;
      break;
    case "own_goal":
      totals.ownGoals += quantity;
      break;
    case "saves":
      totals.saves += quantity;
      break;
    case "penalty_save":
      totals.penaltySaves += quantity;
      break;
    case "yellow_card":
      totals.yellowCards += quantity;
      break;
    case "red_card":
      totals.redCards += quantity;
      break;
    case "motm":
      totals.motm += quantity;
      break;
    default:
      break;
  }
}

export type LeaderboardMetric =
  "goals" | "assists" | "cleanSheets" | "yellowCards" | "redCards" | "saves" | "motm";

export function topByMetric(
  rows: readonly PlayerStatTotals[],
  metric: LeaderboardMetric,
  limit: number,
): PlayerStatTotals[] {
  return [...rows]
    .filter((row) => row[metric] > 0)
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, limit);
}
