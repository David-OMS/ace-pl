"use client";

import type { RosterPickPlayer } from "./roster-player-picker";

type RosterPickListProps = {
  players: readonly RosterPickPlayer[];
  selected: ReadonlySet<string>;
  onToggle: (playerId: string) => void;
};

export function RosterPickList({
  players,
  selected,
  onToggle,
}: RosterPickListProps): React.JSX.Element {
  return (
    <ul className="flex max-h-[50vh] flex-col divide-y divide-line-soft overflow-y-auto rounded-card border-2 border-line bg-surface">
      {players.map((player) => {
        const isOn = selected.has(player.id);
        return (
          <li key={player.id}>
            <button
              type="button"
              onClick={() => onToggle(player.id)}
              aria-pressed={isOn}
              className={`flex min-h-12 w-full items-center gap-2 px-3 text-left text-sm font-bold ${
                isOn ? "bg-line-soft text-muted opacity-60" : ""
              }`}
            >
              <span className="w-10 text-xs">{player.position}</span>
              <span className="flex-1">{player.name}</span>
              {isOn ? <span className="text-xs font-bold uppercase">In</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
