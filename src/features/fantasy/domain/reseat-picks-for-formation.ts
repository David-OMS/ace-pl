import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { buildPitchSlots } from "./build-pitch-slots";

export type ReseatPick = {
  playerId: string;
  position: PlayerPosition;
  price: number;
  isCaptain: boolean;
  isVice: boolean;
};

export type ReseatedPick = ReseatPick & {
  slotKey: string;
  isBench: boolean;
};

/** Place current players onto a new formation; leftovers go to bench. */
export function reseatPicksForFormation(args: {
  formation: FantasyFormation;
  squadSize: number;
  picks: readonly ReseatPick[];
}): ReseatedPick[] {
  const slots = buildPitchSlots(args.formation, args.squadSize);
  const unused = [...args.picks];
  const placed: ReseatedPick[] = [];

  for (const slot of slots.filter((s) => !s.isBench)) {
    const index = unused.findIndex((p) => p.position === slot.position);
    if (index < 0) continue;
    const [player] = unused.splice(index, 1);
    if (!player) continue;
    placed.push({
      ...player,
      slotKey: slot.key,
      isBench: false,
    });
  }

  for (const slot of slots.filter((s) => s.isBench)) {
    const player = unused.shift();
    if (!player || player.position === "GK") continue;
    placed.push({
      ...player,
      slotKey: slot.key,
      isBench: true,
      isCaptain: false,
      isVice: false,
    });
  }

  return placed;
}
