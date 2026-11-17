export type PriceSnapshot = {
  playerId: string;
  price: number;
  /** Fantasy teams currently owning the player. */
  ownership: number;
  /** Transfers in − transfers out since the last evaluation. */
  netTransfers: number;
};

export type PriceChangeRules = {
  activeTeams: number;
  floor: number;
  ceiling: number;
  step: number;
  maxStepsPerGw: number;
  riseTeamShare: number;
  fallOwnershipShare: number;
  minThreshold: number;
};

export type PriceChange = {
  playerId: string;
  oldPrice: number;
  newPrice: number;
  delta: number;
};

function riseThreshold(rules: PriceChangeRules): number {
  return Math.max(rules.minThreshold, Math.ceil(rules.activeTeams * rules.riseTeamShare));
}

function fallThreshold(ownership: number, rules: PriceChangeRules): number {
  return Math.max(rules.minThreshold, Math.ceil(ownership * rules.fallOwnershipShare));
}

function clampPrice(price: number, rules: PriceChangeRules): number {
  const stepped = Math.round(price / rules.step) * rules.step;
  return Math.min(rules.ceiling, Math.max(rules.floor, Number(stepped.toFixed(1))));
}

function stepsFromNet(net: number, threshold: number, maxSteps: number): number {
  if (threshold <= 0 || net < threshold) return 0;
  return Math.min(maxSteps, Math.floor(net / threshold));
}

/** One gameweek evaluation: ownership-driven rises/falls (ACE PL rules). */
export function calculatePriceChanges(
  players: readonly PriceSnapshot[],
  rules: PriceChangeRules,
): PriceChange[] {
  const riseT = riseThreshold(rules);
  const out: PriceChange[] = [];

  for (const player of players) {
    let steps = 0;
    if (player.netTransfers > 0) {
      steps = stepsFromNet(player.netTransfers, riseT, rules.maxStepsPerGw);
    } else if (player.netTransfers < 0) {
      const fallT = fallThreshold(player.ownership, rules);
      steps = -stepsFromNet(-player.netTransfers, fallT, rules.maxStepsPerGw);
    }
    if (steps === 0) continue;

    const oldPrice = player.price;
    const newPrice = clampPrice(oldPrice + steps * rules.step, rules);
    if (newPrice === oldPrice) continue;
    out.push({
      playerId: player.playerId,
      oldPrice,
      newPrice,
      delta: Number((newPrice - oldPrice).toFixed(1)),
    });
  }

  return out;
}

export function priceChangeThresholds(rules: PriceChangeRules): {
  rise: number;
  fallForOwnership: (ownership: number) => number;
} {
  return {
    rise: riseThreshold(rules),
    fallForOwnership: (ownership) => fallThreshold(ownership, rules),
  };
}
