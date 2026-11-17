import { canSwapPitchPicks } from "./can-swap-pitch-picks";

export type SwappablePick = {
  playerId: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

/** Swap starter ↔ bench; captain/vice clear if that player goes to the bench. */
export function swapPitchPicks<T extends SwappablePick>(
  picks: readonly T[],
  playerIdA: string,
  playerIdB: string,
): T[] | null {
  const a = picks.find((p) => p.playerId === playerIdA);
  const b = picks.find((p) => p.playerId === playerIdB);
  if (!a || !b || !canSwapPitchPicks(a, b)) return null;

  return picks.map((pick) => {
    if (pick.playerId === a.playerId) {
      const toBench = b.isBench;
      return {
        ...pick,
        isBench: toBench,
        isCaptain: toBench ? false : pick.isCaptain,
        isVice: toBench ? false : pick.isVice,
      };
    }
    if (pick.playerId === b.playerId) {
      const toBench = a.isBench;
      return {
        ...pick,
        isBench: toBench,
        isCaptain: toBench ? false : pick.isCaptain,
        isVice: toBench ? false : pick.isVice,
      };
    }
    return pick;
  });
}
