import type { PlayerPosition } from "@/config/player-positions";

export type PitchSwapPick = {
  playerId: string;
  position: PlayerPosition;
  isBench: boolean;
};

/** Free XI ↔ bench rearrange (FPL-style). Same position; GK never (no bench GK). */
export function canSwapPitchPicks(a: PitchSwapPick, b: PitchSwapPick): boolean {
  if (a.playerId === b.playerId) return false;
  if (a.position === "GK" || b.position === "GK") return false;
  if (a.position !== b.position) return false;
  return a.isBench !== b.isBench;
}
