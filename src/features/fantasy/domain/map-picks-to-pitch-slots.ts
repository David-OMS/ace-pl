import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { buildPitchSlots, type PitchSlot } from "./build-pitch-slots";

type PitchPick = {
  playerId: string;
  slot: number;
  isBench: boolean;
};

/**
 * Map picks onto formation slots by saved slot index.
 * Incomplete squads keep placed players and leave the rest empty (pre-deadline edit).
 */
export function mapPicksToPitchSlots<T extends PitchPick>(
  formation: FantasyFormation,
  picks: readonly T[],
): { slots: PitchSlot[]; pickBySlotKey: Map<string, T> } {
  const slots = buildPitchSlots(formation, FANTASY_SQUAD_SIZE);
  const byIndex = new Map(picks.map((pick) => [pick.slot, pick]));
  const pickBySlotKey = new Map<string, T>();
  for (let index = 0; index < slots.length; index += 1) {
    const slot = slots[index];
    const pick = byIndex.get(index);
    if (slot && pick) pickBySlotKey.set(slot.key, pick);
  }
  return { slots, pickBySlotKey };
}

export function pitchSlotIndex(formation: FantasyFormation, slotKey: string): number {
  const slots = buildPitchSlots(formation, FANTASY_SQUAD_SIZE);
  return slots.findIndex((slot) => slot.key === slotKey);
}
