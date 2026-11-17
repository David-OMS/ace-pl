import type { PlayerStatTotals } from "./aggregate-player-stats";

/** Fold assist / clean-sheet maps into aggregated rows (creates missing players). */
export function mergeStatExtras(
  rows: PlayerStatTotals[],
  assists: ReadonlyMap<string, number>,
  cleanSheets: ReadonlyMap<string, number>,
): PlayerStatTotals[] {
  const byId = new Map(rows.map((row) => [row.playerId, { ...row }]));

  for (const [playerId, value] of assists) {
    const row = ensureRow(byId, playerId);
    row.assists = value;
  }
  for (const [playerId, value] of cleanSheets) {
    const row = ensureRow(byId, playerId);
    row.cleanSheets = value;
  }
  return [...byId.values()];
}

function ensureRow(byId: Map<string, PlayerStatTotals>, playerId: string): PlayerStatTotals {
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
