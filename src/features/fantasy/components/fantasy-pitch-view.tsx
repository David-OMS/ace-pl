import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { buildPitchSlots, type PitchSlot } from "../domain/build-pitch-slots";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { PitchPickMeta } from "./build-pitch-points-meta";
import { buildPitchPickMap } from "./build-pitch-pick-map";
import { FantasyPitchBench, FantasyPitchOutfield } from "./fantasy-pitch-lines";
import { FantasyPitchSurface } from "./fantasy-pitch-surface";

export type { PitchPickMeta };

type FantasyPitchViewProps = {
  formation?: FantasyFormation;
  picks: readonly FantasyPickView[];
  onSelect?: ((pick: FantasyPickView) => void) | undefined;
  onSelectEmpty?: ((slot: PitchSlot) => void) | undefined;
  selectedId?: string | null | undefined;
  swapTargetIds?: ReadonlySet<string> | undefined;
  metaByPlayerId?: ReadonlyMap<string, PitchPickMeta> | undefined;
};

export function FantasyPitchView({
  formation = "2-2-2",
  picks,
  onSelect,
  onSelectEmpty,
  selectedId,
  swapTargetIds,
  metaByPlayerId,
}: FantasyPitchViewProps): React.JSX.Element {
  const slots = buildPitchSlots(formation, FANTASY_SQUAD_SIZE);
  const pickBySlot = buildPitchPickMap(formation, picks);
  const shared = {
    slots,
    pickBySlot,
    onSelect,
    onSelectEmpty,
    selectedId,
    swapTargetIds,
    metaByPlayerId,
  };

  return (
    <div className="flex flex-col gap-3">
      <FantasyPitchSurface>
        <FantasyPitchOutfield {...shared} />
      </FantasyPitchSurface>
      <div className="rounded-card border-2 border-line bg-surface p-3">
        <p className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
          Bench · auto-sub
        </p>
        <FantasyPitchBench {...shared} />
      </div>
    </div>
  );
}
