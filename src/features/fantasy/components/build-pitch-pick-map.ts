import type { FantasyFormation } from "@/config/fantasy";

import { mapPicksToPitchSlots } from "../domain/map-picks-to-pitch-slots";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

/** Place picks on the pitch by slot index; incomplete squads leave holes, not a blank pitch. */
export function buildPitchPickMap(
  formation: FantasyFormation,
  picks: readonly FantasyPickView[],
): Map<string, FantasyPickView & { slotKey: string }> {
  const { pickBySlotKey } = mapPicksToPitchSlots(formation, picks);
  return new Map(
    [...pickBySlotKey.entries()].map(([slotKey, pick]) => [
      slotKey,
      { ...pick, slotKey } satisfies FantasyPickView & { slotKey: string },
    ]),
  );
}
