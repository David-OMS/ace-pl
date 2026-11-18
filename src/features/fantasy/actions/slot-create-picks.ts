import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { assignSlotsFromSquad } from "../domain/assign-slots-from-squad";

type CreatePick = {
  playerId: string;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

type PoolPlayer = {
  id: string;
  position: PlayerPosition;
  price: number;
};

export function slotCreatePicks(
  formation: FantasyFormation,
  picks: readonly CreatePick[],
  pool: readonly PoolPlayer[],
) {
  const byId = new Map(pool.map((p) => [p.id, p]));
  const resolved = picks.flatMap((pick) => {
    const player = byId.get(pick.playerId);
    if (!player) return [];
    return [
      {
        playerId: pick.playerId,
        position: player.position,
        price: player.price,
        isBench: pick.isBench,
        isCaptain: pick.isCaptain,
        isVice: pick.isVice,
      },
    ];
  });
  if (resolved.length !== picks.length) return null;

  const slotted = assignSlotsFromSquad({
    formation,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: resolved,
  });
  if (!slotted) return null;

  return slotted.map((pick) => ({
    playerId: pick.playerId,
    slot: pick.slot,
    isBench: pick.isBench,
    isCaptain: pick.isCaptain,
    isVice: pick.isVice,
    purchasePrice: pick.price,
  }));
}
