import { fantasyCopy } from "../copy";
import type { DraftSlotPick } from "../domain/assign-slot-pick";
import type { PitchSlot } from "../domain/build-pitch-slots";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { EmptyPitchSlot, FantasyPitchSlot } from "./fantasy-pitch-slot";
import { toneForSlot } from "./pitch-slot-tone";

type PitchSlotLineProps = {
  slots: readonly PitchSlot[];
  picksBySlot: ReadonlyMap<string, DraftSlotPick>;
  playersById: ReadonlyMap<string, PickablePlayer>;
  onOpen: (slot: PitchSlot) => void;
};

export function PitchSlotLine({
  slots,
  picksBySlot,
  playersById,
  onOpen,
}: PitchSlotLineProps): React.JSX.Element | null {
  if (slots.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {slots.map((slot) => {
        const tone = toneForSlot(slot);
        const pick = picksBySlot.get(slot.key);
        const player = pick ? (playersById.get(pick.playerId) ?? null) : null;
        if (player) {
          return (
            <FantasyPitchSlot
              key={slot.key}
              name={player.name}
              photoUrl={player.photoUrl}
              meta={formatFantasyPrice(player.price)}
              tone={tone}
              onSelect={() => onOpen(slot)}
            />
          );
        }
        return (
          <EmptyPitchSlot
            key={slot.key}
            label={slot.isBench ? fantasyCopy.benchSlot : slot.position}
            tone={tone}
            onSelect={() => onOpen(slot)}
          />
        );
      })}
    </div>
  );
}
