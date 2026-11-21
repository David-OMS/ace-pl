import type { DraftSlotPick } from "../domain/assign-slot-pick";
import type { PickablePlayer } from "../queries/list-pickable-players";

export function draftClubBannerPicks(
  picks: readonly DraftSlotPick[],
  pool: readonly PickablePlayer[],
): { clubTeamId: string | null; clubName: string | null }[] {
  return picks.map((pick) => {
    const player = pool.find((p) => p.id === pick.playerId);
    return {
      clubTeamId: pick.clubTeamId ?? player?.clubTeamId ?? null,
      clubName: player?.clubName ?? null,
    };
  });
}
