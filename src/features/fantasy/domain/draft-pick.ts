import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { parseFormation } from "./parse-formation";

export type DraftPick = {
  playerId: string;
  position: PlayerPosition;
  price: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
  clubTeamId?: string | null;
};

export function starterNeeds(formation: FantasyFormation): Record<PlayerPosition, number> {
  const parsed = parseFormation(formation);
  if (!parsed) return { GK: 1, DEF: 0, MID: 0, FWD: 0 };
  return { GK: 1, DEF: parsed.def, MID: parsed.mid, FWD: parsed.fwd };
}

export function countStartersByPosition(
  picks: readonly DraftPick[],
): Record<PlayerPosition, number> {
  const counts: Record<PlayerPosition, number> = {
    GK: 0,
    DEF: 0,
    MID: 0,
    FWD: 0,
  };
  for (const pick of picks) {
    if (!pick.isBench) counts[pick.position] += 1;
  }
  return counts;
}

export function canAddAsStarter(
  formation: FantasyFormation,
  picks: readonly DraftPick[],
  position: PlayerPosition,
): boolean {
  const needs = starterNeeds(formation);
  const have = countStartersByPosition(picks);
  return have[position] < needs[position];
}
