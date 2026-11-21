import type { PlayerPosition } from "@/config/player-positions";

export type PitchSwapPick = {
  playerId: string;
  position: PlayerPosition;
  isBench: boolean;
};

/**
 * Free pitch rearrange: same outfield position.
 * Starter↔bench, two starters, or two bench — GK never moves this way.
 */
export function canSwapPitchPicks(a: PitchSwapPick, b: PitchSwapPick): boolean {
  if (a.playerId === b.playerId) return false;
  if (a.position === "GK" || b.position === "GK") return false;
  return a.position === b.position;
}
