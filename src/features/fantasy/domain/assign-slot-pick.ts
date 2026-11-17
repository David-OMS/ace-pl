import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import type { PitchSlot } from "./build-pitch-slots";
import type { DraftPick } from "./draft-pick";
import { isWithinBudget } from "./fantasy-budget";

export type SlotPickPlayer = {
  id: string;
  position: PlayerPosition;
  price: number;
};

export type DraftSlotPick = DraftPick & { slotKey: string };

/** Place or clear a player on a pitch/bench slot. */
export function assignSlotPick(args: {
  formation: FantasyFormation;
  squadSize: number;
  budget: number;
  picks: readonly DraftSlotPick[];
  slot: PitchSlot;
  player: SlotPickPlayer | null;
}): DraftSlotPick[] {
  const withoutSlot = args.picks.filter((p) => p.slotKey !== args.slot.key);
  if (!args.player) return withoutSlot;

  const player = args.player;
  const withoutPlayer = withoutSlot.filter((p) => p.playerId !== player.id);
  const spent = withoutPlayer.reduce((sum, p) => sum + p.price, 0);
  if (!isWithinBudget(spent, player.price, args.budget)) {
    return [...args.picks];
  }

  if (!args.slot.isBench && player.position !== args.slot.position) {
    return [...args.picks];
  }
  if (args.slot.isBench && player.position === "GK") {
    return [...args.picks];
  }

  return [
    ...withoutPlayer,
    {
      slotKey: args.slot.key,
      playerId: player.id,
      position: player.position,
      price: player.price,
      isBench: args.slot.isBench,
      isCaptain: false,
      isVice: false,
    },
  ];
}
