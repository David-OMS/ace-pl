"use client";

import { useMemo, useState } from "react";

import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";

import { teamsCopy } from "../copy";
import { PlayerPickList } from "./player-pick-list";

export type PickablePlayer = { id: string; name: string; position: string };

type PlayerMultiPickerProps = {
  players: readonly PickablePlayer[];
  selectedIds: ReadonlySet<string>;
  maxSelectable: number;
  onChange: (next: Set<string>) => void;
  /** Closed until the user opens it. Default true. */
  startClosed?: boolean;
};

export function PlayerMultiPicker({
  players,
  selectedIds,
  maxSelectable,
  onChange,
  startClosed = true,
}: PlayerMultiPickerProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(!startClosed);
  const filtered = useMemo(() => filterPlayers(players, query), [players, query]);

  if (!open) {
    return (
      <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(true)}>
        {teamsCopy.addPlayers}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-card border-2 border-line bg-surface p-3">
      <TextField
        label={teamsCopy.searchPlayers}
        name="teamPlayerSearch"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={teamsCopy.searchPlaceholder}
        autoComplete="off"
      />
      <p className="text-xs font-bold text-muted">
        {teamsCopy.pickedCount(selectedIds.size, maxSelectable)}
      </p>
      <PlayerPickList
        players={filtered}
        selectedIds={selectedIds}
        maxSelectable={maxSelectable}
        onToggle={(playerId) => onChange(togglePick(selectedIds, playerId, maxSelectable))}
      />
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={() => {
          setOpen(false);
          setQuery("");
        }}
      >
        {teamsCopy.donePicking}
      </Button>
    </div>
  );
}

function filterPlayers(players: readonly PickablePlayer[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return players;
  return players.filter(
    (player) =>
      player.name.toLowerCase().includes(needle) || player.position.toLowerCase().includes(needle),
  );
}

function togglePick(
  selectedIds: ReadonlySet<string>,
  playerId: string,
  maxSelectable: number,
): Set<string> {
  const next = new Set(selectedIds);
  if (next.has(playerId)) {
    next.delete(playerId);
    return next;
  }
  if (next.size >= maxSelectable) return next;
  next.add(playerId);
  return next;
}
