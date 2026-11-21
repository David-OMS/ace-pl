"use client";

import { PlayerAvatar } from "@/ui/player-avatar";

import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { PickablePlayer } from "../queries/list-pickable-players";
import { FantasyBottomSheet } from "./fantasy-bottom-sheet";

type TransferInPickerProps = {
  title: string;
  hint: string;
  options: readonly PickablePlayer[];
  onPick: (player: PickablePlayer) => void;
  onClose: () => void;
  onRemove?: (() => void) | undefined;
};

export function TransferInPicker({
  title,
  hint,
  options,
  onPick,
  onClose,
  onRemove,
}: TransferInPickerProps): React.JSX.Element {
  return (
    <FantasyBottomSheet onClose={onClose}>
      <PickerHeader title={title} hint={hint} onClose={onClose} />
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="w-full border-b border-line-soft px-4 py-3 text-left text-sm font-bold text-hot"
        >
          {fantasyCopy.removeFromSquad}
        </button>
      ) : null}
      <TransferOptionsList options={options} onPick={onPick} />
    </FantasyBottomSheet>
  );
}

function PickerHeader(args: {
  title: string;
  hint: string;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b-2 border-line px-4 py-3">
      <div>
        <p className="font-display text-lg uppercase">{args.title}</p>
        <p className="text-xs text-muted">{args.hint}</p>
      </div>
      <button type="button" className="text-sm font-bold" onClick={args.onClose}>
        {fantasyCopy.closePicker}
      </button>
    </div>
  );
}

function TransferOptionsList(args: {
  options: readonly PickablePlayer[];
  onPick: (player: PickablePlayer) => void;
}): React.JSX.Element {
  if (args.options.length === 0) {
    return <p className="px-4 py-4 text-sm font-bold text-hazard">{fantasyCopy.broke}</p>;
  }
  return (
    <ul className="max-h-[50vh] overflow-y-auto">
      {args.options.map((player) => (
        <li key={player.id} className="border-b border-line-soft last:border-b-0">
          <button
            type="button"
            onClick={() => args.onPick(player)}
            className="flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left"
          >
            <PlayerAvatar name={player.name} photoUrl={player.photoUrl} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">{player.name}</span>
              <span className="block text-xs text-muted">
                {player.position}
                {player.clubName ? ` · ${player.clubName}` : ""}
              </span>
            </span>
            <span className="font-display text-lg">{formatFantasyPrice(player.price)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
