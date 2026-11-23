type FingerprintPick = {
  playerId: string;
  slot: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

/** Includes slot so bench/starter seat swaps count as lineup edits. */
export function picksFingerprint(picks: readonly FingerprintPick[]): string {
  return picks
    .map(
      (p) =>
        `${p.playerId}:${p.slot}:${p.isBench ? 1 : 0}:${p.isCaptain ? 1 : 0}:${p.isVice ? 1 : 0}`,
    )
    .sort()
    .join("|");
}
