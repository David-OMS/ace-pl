import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { assignSlotsFromSquad } from "../domain/assign-slots-from-squad";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

/** Place picks using their starter/bench flags (same rules as save). */
export function buildPitchPickMap(
  formation: FantasyFormation,
  picks: readonly FantasyPickView[],
): Map<string, FantasyPickView & { slotKey: string }> {
  const slotted = assignSlotsFromSquad({
    formation,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: picks.map((p) => ({
      playerId: p.playerId,
      position: p.position,
      price: p.price,
      isBench: p.isBench,
      isCaptain: p.isCaptain,
      isVice: p.isVice,
    })),
  });

  if (!slotted) return new Map();

  return new Map(
    slotted.map((seat) => {
      const prior = picks.find((p) => p.playerId === seat.playerId);
      return [
        seat.slotKey,
        {
          playerId: seat.playerId,
          name: prior?.name ?? "?",
          position: seat.position,
          photoUrl: prior?.photoUrl ?? null,
          rank: prior?.rank ?? "C",
          price: seat.price,
          slot: seat.slot,
          isBench: seat.isBench,
          isCaptain: seat.isCaptain,
          isVice: seat.isVice,
          slotKey: seat.slotKey,
        } satisfies FantasyPickView & { slotKey: string },
      ] as const;
    }),
  );
}
