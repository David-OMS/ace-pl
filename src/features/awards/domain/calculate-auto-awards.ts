import type { PlayerStatTotals } from "@/features/leaderboards";

export type AutoAwardWinner = {
  playerId: string;
  name: string;
  value: number;
};

export type AutoAwardsResult = {
  goldenBoot: AutoAwardWinner[];
  playmaker: AutoAwardWinner[];
  goldenGlove: AutoAwardWinner[];
};

type NamedStats = PlayerStatTotals & { name: string; goalsConceded: number };

/** Shared winners when tied on the deciding metric(s). */
export function calculateAutoAwards(rows: readonly NamedStats[]): AutoAwardsResult {
  return {
    goldenBoot: topBy((r) => r.goals, rows),
    playmaker: topBy((r) => r.assists, rows),
    goldenGlove: topGoldenGlove(rows),
  };
}

function topBy(
  metric: (row: NamedStats) => number,
  rows: readonly NamedStats[],
): AutoAwardWinner[] {
  let best = -1;
  const winners: AutoAwardWinner[] = [];
  for (const row of rows) {
    const value = metric(row);
    if (value <= 0) continue;
    if (value > best) {
      best = value;
      winners.length = 0;
      winners.push({ playerId: row.playerId, name: row.name, value });
    } else if (value === best) {
      winners.push({ playerId: row.playerId, name: row.name, value });
    }
  }
  return winners;
}

function topGoldenGlove(rows: readonly NamedStats[]): AutoAwardWinner[] {
  const keepers = rows.filter((r) => r.cleanSheets > 0 || r.saves > 0);
  if (keepers.length === 0) return [];

  const ranked = [...keepers].sort((a, b) => {
    if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
    if (b.saves !== a.saves) return b.saves - a.saves;
    return a.goalsConceded - b.goalsConceded;
  });
  const lead = ranked[0];
  if (!lead) return [];

  return ranked
    .filter(
      (r) =>
        r.cleanSheets === lead.cleanSheets &&
        r.saves === lead.saves &&
        r.goalsConceded === lead.goalsConceded,
    )
    .map((r) => ({
      playerId: r.playerId,
      name: r.name,
      value: r.cleanSheets,
    }));
}
