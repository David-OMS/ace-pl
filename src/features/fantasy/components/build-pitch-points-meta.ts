import { fantasyCopy } from "../copy";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";

export type PitchPickMeta = {
  playerId: string;
  meta: string;
  dimmed: boolean;
};

export function buildPitchPointsMeta(
  gameweek: FantasyGameweekView | null,
): Map<string, PitchPickMeta> | undefined {
  if (!gameweek) return undefined;
  return new Map(
    gameweek.picks.map((pick) => [
      pick.playerId,
      {
        playerId: pick.playerId,
        // Bench not used still shows their haul; dimmed = did not count. XI uses applied (C/V).
        meta: fantasyCopy.pointsMeta(pick.inXi ? pick.appliedPoints : pick.rawPoints),
        dimmed: !pick.inXi,
      },
    ]),
  );
}
