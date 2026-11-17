import { fantasyCopy } from "../copy";
import type { PitchSlot } from "../domain/build-pitch-slots";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { PitchPickMeta } from "./build-pitch-points-meta";
import { EmptyPitchSlot, FantasyPitchSlot } from "./fantasy-pitch-slot";
import { toneForSlot } from "./pitch-slot-tone";

type PickOnPitch = FantasyPickView & { slotKey: string };

type FantasyPitchLinesProps = {
  slots: readonly PitchSlot[];
  pickBySlot: ReadonlyMap<string, PickOnPitch>;
  onSelect?: ((pick: FantasyPickView) => void) | undefined;
  onSelectEmpty?: ((slot: PitchSlot) => void) | undefined;
  selectedId?: string | null | undefined;
  swapTargetIds?: ReadonlySet<string> | undefined;
  metaByPlayerId?: ReadonlyMap<string, PitchPickMeta> | undefined;
};

function badgeFor(pick: FantasyPickView): string | null {
  if (pick.isCaptain) return "C";
  if (pick.isVice) return "V";
  return null;
}

export function FantasyPitchOutfield(props: FantasyPitchLinesProps): React.JSX.Element {
  const lineKeys = ["FWD", "MID", "DEF", "GK"] as const;
  return (
    <>
      {lineKeys.map((line) => (
        <div key={line} className="flex flex-wrap justify-center gap-3">
          {props.slots
            .filter((s) => s.line === line)
            .map((slot) => (
              <PitchCell
                key={slot.key}
                slot={slot}
                pick={props.pickBySlot.get(slot.key)}
                {...props}
              />
            ))}
        </div>
      ))}
    </>
  );
}

export function FantasyPitchBench(props: FantasyPitchLinesProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-3">
      {props.slots
        .filter((s) => s.isBench)
        .map((slot) => (
          <PitchCell key={slot.key} slot={slot} pick={props.pickBySlot.get(slot.key)} {...props} />
        ))}
    </div>
  );
}

// eslint-disable-next-line complexity -- pitch cell selection / dim / meta states
function PitchCell(
  props: FantasyPitchLinesProps & {
    slot: PitchSlot;
    pick: PickOnPitch | undefined;
  },
): React.JSX.Element | null {
  const { slot, pick, onSelect, onSelectEmpty, selectedId, swapTargetIds, metaByPlayerId } = props;
  const tone = toneForSlot(slot);
  const selecting = Boolean(selectedId);

  if (pick) {
    const override = metaByPlayerId?.get(pick.playerId);
    const isSwapTarget = swapTargetIds?.has(pick.playerId) === true;
    const dimmed =
      override?.dimmed === true || (selecting && selectedId !== pick.playerId && !isSwapTarget);
    return (
      <FantasyPitchSlot
        name={pick.name}
        photoUrl={pick.photoUrl}
        badge={badgeFor(pick)}
        meta={override?.meta ?? (onSelect ? formatFantasyPrice(pick.price) : undefined)}
        tone={tone}
        selected={selectedId === pick.playerId}
        swapTarget={isSwapTarget}
        dimmed={dimmed}
        onSelect={onSelect ? () => onSelect(pick) : undefined}
      />
    );
  }
  if (!onSelectEmpty) return null;
  return (
    <EmptyPitchSlot
      label={slot.isBench ? fantasyCopy.benchSlot : slot.position}
      tone={tone}
      onSelect={() => onSelectEmpty(slot)}
    />
  );
}
