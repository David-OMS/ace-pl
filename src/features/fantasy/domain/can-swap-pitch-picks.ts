import type { PlayerPosition } from "@/config/player-positions";

export type PitchSwapPick = {
  playerId: string;
  position: PlayerPosition;
  isBench: boolean;
};

/**
 * Free pitch rearrange:
 * - bench ↔ bench: any outfield (auto-sub order)
 * - otherwise: same outfield position (starter ↔ starter / starter ↔ bench)
 * GK never moves this way.
 */
export function canSwapPitchPicks(a: PitchSwapPick, b: PitchSwapPick): boolean {
  if (a.playerId === b.playerId) return false;
  if (a.position === "GK" || b.position === "GK") return false;
  if (a.isBench && b.isBench) return true;
  return a.position === b.position;
}
