import { Button } from "@/ui/button";

import type { DraftSlotPick } from "../domain/assign-slot-pick";
import { fantasyCopy } from "../copy";
import type { PickablePlayer } from "../queries/list-pickable-players";

type CreateStepCaptainProps = {
  pool: readonly PickablePlayer[];
  picks: readonly DraftSlotPick[];
  onChange: (picks: DraftSlotPick[]) => void;
};

function withRole(
  picks: readonly DraftSlotPick[],
  playerId: string,
  role: "captain" | "vice",
): DraftSlotPick[] {
  return picks.map((pick) => {
    if (role === "captain") {
      return {
        ...pick,
        isCaptain: pick.playerId === playerId,
        isVice: pick.playerId === playerId ? false : pick.isVice,
      };
    }
    return {
      ...pick,
      isVice: pick.playerId === playerId,
      isCaptain: pick.playerId === playerId ? false : pick.isCaptain,
    };
  });
}

export function CreateStepCaptain({
  pool,
  picks,
  onChange,
}: CreateStepCaptainProps): React.JSX.Element {
  const byId = new Map(pool.map((p) => [p.id, p]));
  const starters = picks.filter((p) => !p.isBench);

  return (
    <ul className="flex flex-col gap-2">
      {starters.map((pick) => {
        const player = byId.get(pick.playerId);
        if (!player) return null;
        return (
          <li
            key={pick.playerId}
            className="flex flex-wrap items-center gap-2 rounded-card border-2 border-line bg-surface px-3 py-2"
          >
            <span className="min-w-0 flex-1 font-bold">{player.name}</span>
            <Button
              type="button"
              variant={pick.isCaptain ? "primary" : "secondary"}
              onClick={() => onChange(withRole(picks, pick.playerId, "captain"))}
            >
              {fantasyCopy.setCaptain}
            </Button>
            <Button
              type="button"
              variant={pick.isVice ? "primary" : "secondary"}
              onClick={() => onChange(withRole(picks, pick.playerId, "vice"))}
            >
              {fantasyCopy.setVice}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
