import type { PlayerPosition } from "@/config/player-positions";

import {
  calculatePlayerFantasyPoints,
  type FantasyPointsInput,
} from "./calculate-player-fantasy-points";

/** Score each match on its own, then add up for the GW / season total. */
export function sumMatchFantasyPoints(
  position: PlayerPosition,
  matches: readonly FantasyPointsInput[],
): number {
  let total = 0;
  for (const match of matches) {
    total += calculatePlayerFantasyPoints(position, match);
  }
  return total;
}
