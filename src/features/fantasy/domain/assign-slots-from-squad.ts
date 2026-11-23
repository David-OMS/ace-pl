import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { buildPitchSlots } from "./build-pitch-slots";

export type SlotAssignPick = {
  playerId: string;
  position: PlayerPosition;
  price: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
  /** Client seat order — kept for same-position / bench rearranges. */
  slot?: number;
};

export type SlottedPick = SlotAssignPick & { slotKey: string; slot: number };

/** Honour client starter/bench flags and seat order when writing picks. */
export function assignSlotsFromSquad(args: {
  formation: FantasyFormation;
  squadSize: number;
  picks: readonly SlotAssignPick[];
}): SlottedPick[] | null {
  const slots = buildPitchSlots(args.formation, args.squadSize);
  if (slots.length === 0) return null;

  const bySeat = (a: SlotAssignPick, b: SlotAssignPick): number =>
    (a.slot ?? Number.MAX_SAFE_INTEGER) - (b.slot ?? Number.MAX_SAFE_INTEGER);

  const unusedStarters = args.picks.filter((p) => !p.isBench).sort(bySeat);
  const unusedBench = args.picks.filter((p) => p.isBench).sort(bySeat);
  const placed: SlottedPick[] = [];

  for (const slot of slots.filter((s) => !s.isBench)) {
    const index = unusedStarters.findIndex((p) => p.position === slot.position);
    if (index < 0) return null;
    const [player] = unusedStarters.splice(index, 1);
    if (!player) return null;
    placed.push({ ...player, slotKey: slot.key, slot: placed.length, isBench: false });
  }

  for (const slot of slots.filter((s) => s.isBench)) {
    const player = unusedBench.shift();
    if (!player || player.position === "GK") return null;
    placed.push({
      ...player,
      slotKey: slot.key,
      slot: placed.length,
      isBench: true,
      isCaptain: false,
      isVice: false,
    });
  }

  if (unusedStarters.length > 0 || unusedBench.length > 0) return null;
  return placed;
}
