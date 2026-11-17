"use client";

import type { PickablePlayer } from "./player-multi-picker";

type PlayerPickListProps = {
  players: readonly PickablePlayer[];
  selectedIds: ReadonlySet<string>;
  maxSelectable: number;
  onToggle: (playerId: string) => void;
};

export function PlayerPickList({
  players,
  selectedIds,
  maxSelectable,
  onToggle,
}: PlayerPickListProps): React.JSX.Element {
  return (
    <ul className="flex max-h-56 flex-col divide-y divide-line-soft overflow-y-auto">
      {players.map((player) => {
        const isOn = selectedIds.has(player.id);
        const blocked = !isOn && selectedIds.size >= maxSelectable;
        return (
          <li key={player.id}>
            <button
              type="button"
              disabled={blocked}
              onClick={() => onToggle(player.id)}
              className={`flex min-h-11 w-full items-center gap-2 px-2 text-left text-sm font-bold disabled:opacity-40 ${
                isOn ? "bg-accent text-on-accent" : ""
              }`}
            >
              <span className="w-10 text-xs">{player.position}</span>
              <span className="flex-1">{player.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
