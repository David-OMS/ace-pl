"use client";

import { PlayerAvatar } from "@/ui/player-avatar";

import { fantasyCopy } from "../copy";
import type { PitchSlot } from "../domain/build-pitch-slots";
import { filterPoolForSlot } from "../domain/filter-pool-for-slot";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { PickablePlayer } from "../queries/list-pickable-players";

type PlayerPickerSheetProps = {
  slot: PitchSlot;
  pool: readonly PickablePlayer[];
  takenIds: ReadonlySet<string>;
  /** Max they can spend on this slot (bank + refund if replacing). */
  maxPrice: number;
  onPick: (player: PickablePlayer) => void;
  onClear: () => void;
  onClose: () => void;
  hasPlayer: boolean;
};

export function PlayerPickerSheet({
  slot,
  pool,
  takenIds,
  maxPrice,
  onPick,
  onClear,
  onClose,
  hasPlayer,
}: PlayerPickerSheetProps): React.JSX.Element {
  const eligible = filterPoolForSlot(pool, slot, takenIds);
  const affordable = eligible.filter((p) => p.price <= maxPrice);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/40">
      <button type="button" className="min-h-0 flex-1" aria-label="Close" onClick={onClose} />
      <div className="max-h-[70vh] overflow-hidden rounded-t-card border-2 border-line bg-surface">
        <PickerHeader slot={slot} onClose={onClose} />
        {hasPlayer ? (
          <button
            type="button"
            onClick={onClear}
            className="w-full border-b border-line-soft px-4 py-3 text-left text-sm font-bold text-hot"
          >
            {fantasyCopy.clearSlot}
          </button>
        ) : null}
        <PickerList eligibleCount={eligible.length} options={affordable} onPick={onPick} />
      </div>
    </div>
  );
}

function PickerHeader({
  slot,
  onClose,
}: {
  slot: PitchSlot;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b-2 border-line px-4 py-3">
      <div>
        <p className="font-display text-lg uppercase">
          {slot.isBench ? fantasyCopy.bench : slot.position}
        </p>
        <p className="text-xs text-muted">{fantasyCopy.pickFromPool}</p>
      </div>
      <button type="button" className="text-sm font-bold" onClick={onClose}>
        {fantasyCopy.closePicker}
      </button>
    </div>
  );
}

function PickerList({
  eligibleCount,
  options,
  onPick,
}: {
  eligibleCount: number;
  options: readonly PickablePlayer[];
  onPick: (player: PickablePlayer) => void;
}): React.JSX.Element {
  if (eligibleCount === 0) {
    return <p className="px-4 py-4 text-sm text-muted">{fantasyCopy.noPlayersForSlot}</p>;
  }
  if (options.length === 0) {
    return <p className="px-4 py-4 text-sm font-bold text-hazard">{fantasyCopy.broke}</p>;
  }
  return (
    <ul className="max-h-[50vh] overflow-y-auto">
      {options.map((player) => (
        <li key={player.id} className="border-b border-line-soft last:border-b-0">
          <button
            type="button"
            onClick={() => onPick(player)}
            className="flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left"
          >
            <PlayerAvatar name={player.name} photoUrl={player.photoUrl} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">{player.name}</span>
              <span className="block text-xs text-muted">{player.position}</span>
            </span>
            <span className="font-display text-lg">{formatFantasyPrice(player.price)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
