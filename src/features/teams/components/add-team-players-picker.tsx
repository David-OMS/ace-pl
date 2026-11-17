"use client";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import type { ActionErrorCode } from "@/lib/action-result";
import { describeTeamsError, teamsCopy } from "../copy";
import { PlayerPickList } from "./player-pick-list";
import type { PickablePlayer } from "./player-multi-picker";

type PickerModel = {
  tournamentId: string;
  teamId: string;
  openSpots: number;
  availablePlayers: readonly PickablePlayer[];
  selected: Set<string>;
  query: string;
  isPending: boolean;
  error: ActionErrorCode | null;
};

type PickerHandlers = {
  formAction: (payload: FormData) => void;
  onQueryChange: (value: string) => void;
  onToggle: (playerId: string) => void;
  onCancel: () => void;
};

export function AddTeamPlayersPicker({
  model,
  handlers,
}: {
  model: PickerModel;
  handlers: PickerHandlers;
}): React.JSX.Element {
  const filtered = filterPlayers(model.availablePlayers, model.query);

  return (
    <form action={handlers.formAction} className="flex flex-col gap-3">
      <input type="hidden" name="tournamentId" value={model.tournamentId} />
      <input type="hidden" name="teamId" value={model.teamId} />
      {[...model.selected].map((id) => (
        <input key={id} type="hidden" name="playerIds" value={id} />
      ))}
      <TextField
        label={teamsCopy.searchPlayers}
        name="teamPlayerSearch"
        value={model.query}
        onChange={(event) => handlers.onQueryChange(event.target.value)}
        placeholder={teamsCopy.searchPlaceholder}
        autoComplete="off"
      />
      <p className="text-xs font-bold text-muted">
        {teamsCopy.pickedCount(model.selected.size, model.openSpots)}
      </p>
      <PlayerPickList
        players={filtered}
        selectedIds={model.selected}
        maxSelectable={model.openSpots}
        onToggle={handlers.onToggle}
      />
      <FormFeedback error={model.error ? describeTeamsError(model.error) : null} />
      <Button type="submit" fullWidth disabled={model.isPending || model.selected.size === 0}>
        {teamsCopy.confirmAddPlayers}
      </Button>
      <Button type="button" variant="secondary" fullWidth onClick={handlers.onCancel}>
        {teamsCopy.cancelPicking}
      </Button>
    </form>
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
