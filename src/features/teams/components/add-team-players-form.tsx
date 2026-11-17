"use client";

import { useActionState, useState } from "react";

import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import { addPlayersToTeam, type AddPlayersState } from "../actions/add-players-to-team";
import { teamsCopy } from "../copy";
import { AddTeamPlayersPicker } from "./add-team-players-picker";
import type { PickablePlayer } from "./player-multi-picker";

type AddTeamPlayersFormProps = {
  tournamentId: string;
  teamId: string;
  openSpots: number;
  availablePlayers: readonly PickablePlayer[];
};

export function AddTeamPlayersForm(props: AddTeamPlayersFormProps): React.JSX.Element | null {
  const picker = useAddPlayersPicker(props);
  if (props.openSpots <= 0 || props.availablePlayers.length === 0) return null;
  if (!picker.open) {
    return (
      <Button type="button" variant="secondary" fullWidth onClick={() => picker.setOpen(true)}>
        {teamsCopy.addPlayers}
      </Button>
    );
  }
  return (
    <Card className="flex flex-col gap-3">
      <AddTeamPlayersPicker model={picker.model} handlers={picker.handlers} />
    </Card>
  );
}

function useAddPlayersPicker(props: AddTeamPlayersFormProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [clearedFor, setClearedFor] = useState<number | null>(null);
  const [state, formAction, isPending] = useActionState<AddPlayersState, FormData>(
    addPlayersToTeam,
    null,
  );
  useRefreshOnOk(state?.ok);

  const savedAt = state?.ok ? state.data.savedAt : null;
  if (savedAt !== null && clearedFor !== savedAt) {
    setClearedFor(savedAt);
    setSelected(new Set());
    setOpen(false);
    setQuery("");
  }

  return {
    open,
    setOpen,
    model: {
      tournamentId: props.tournamentId,
      teamId: props.teamId,
      openSpots: props.openSpots,
      availablePlayers: props.availablePlayers,
      selected,
      query,
      isPending,
      error: state?.ok === false ? state.error : null,
    },
    handlers: {
      formAction,
      onQueryChange: setQuery,
      onToggle: (playerId: string) => setSelected(togglePick(selected, playerId, props.openSpots)),
      onCancel: () => {
        setOpen(false);
        setSelected(new Set());
        setQuery("");
      },
    },
  };
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
