import { FANTASY_FORMATIONS, type FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { formationFitsSquad } from "./formation-fits-squad";

/**
 * Incomplete squad = still building → every formation stays open.
 * Full squad = only shapes the current players can fill.
 */
export function allowedFantasyFormations(
  positions: readonly PlayerPosition[],
  squadSize: number,
): ReadonlySet<FantasyFormation> {
  if (positions.length < squadSize) {
    return new Set(FANTASY_FORMATIONS);
  }
  return new Set(
    FANTASY_FORMATIONS.filter((shape) => formationFitsSquad({ formation: shape, positions })),
  );
}
