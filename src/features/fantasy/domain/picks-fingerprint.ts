type FingerprintPick = {
  playerId: string;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

export function picksFingerprint(picks: readonly FingerprintPick[]): string {
  return picks
    .map((p) => `${p.playerId}:${p.isBench ? 1 : 0}:${p.isCaptain ? 1 : 0}:${p.isVice ? 1 : 0}`)
    .sort()
    .join("|");
}
