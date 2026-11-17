import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { canAddAsStarter, type DraftPick } from "./draft-pick";
import { isWithinBudget } from "./fantasy-budget";
import { parseFormation } from "./parse-formation";

export type TogglePickPlayer = {
  id: string;
  position: PlayerPosition;
  price: number;
};

export function toggleDraftPick(args: {
  formation: FantasyFormation;
  squadSize: number;
  budget: number;
  picks: readonly DraftPick[];
  player: TogglePickPlayer;
}): DraftPick[] {
  const { formation, squadSize, budget, picks, player } = args;
  if (picks.some((p) => p.playerId === player.id)) {
    return picks.filter((p) => p.playerId !== player.id);
  }
  if (picks.length >= squadSize) return [...picks];

  const spent = picks.reduce((sum, p) => sum + p.price, 0);
  if (!isWithinBudget(spent, player.price, budget)) return [...picks];

  const asStarter = canAddAsStarter(formation, picks, player.position);
  const starterSlots = parseFormation(formation)?.starters ?? 7;
  const benchSlots = squadSize - starterSlots;
  const benchCount = picks.filter((p) => p.isBench).length;
  if (!asStarter && (benchCount >= benchSlots || player.position === "GK")) {
    return [...picks];
  }

  return [
    ...picks,
    {
      playerId: player.id,
      position: player.position,
      price: player.price,
      isBench: !asStarter,
      isCaptain: false,
      isVice: false,
    },
  ];
}
