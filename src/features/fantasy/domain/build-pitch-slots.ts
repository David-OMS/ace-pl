import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { parseFormation } from "./parse-formation";

export type PitchSlot = {
  key: string;
  /** Required position for starter slots; ignored for bench (any outfield). */
  position: PlayerPosition;
  isBench: boolean;
  line: "FWD" | "MID" | "DEF" | "GK" | "BENCH";
  index: number;
};

/** Empty pitch + bench slots for a formation (FWD line first, then MID, DEF, GK). */
export function buildPitchSlots(formation: FantasyFormation, squadSize: number): PitchSlot[] {
  const parsed = parseFormation(formation);
  if (!parsed) return [];

  const starters: PitchSlot[] = [
    ...lineSlots("FWD", parsed.fwd),
    ...lineSlots("MID", parsed.mid),
    ...lineSlots("DEF", parsed.def),
    ...lineSlots("GK", 1),
  ];

  const benchCount = Math.max(0, squadSize - starters.length);
  const bench = Array.from({ length: benchCount }, (_, index) => ({
    key: `BENCH-${index}`,
    position: "MID" as const,
    isBench: true,
    line: "BENCH" as const,
    index,
  }));

  return [...starters, ...bench];
}

function lineSlots(line: "FWD" | "MID" | "DEF" | "GK", count: number): PitchSlot[] {
  return Array.from({ length: count }, (_, index) => ({
    key: `${line}-${index}`,
    position: line,
    isBench: false,
    line,
    index,
  }));
}
