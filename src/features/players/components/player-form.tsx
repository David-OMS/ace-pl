"use client";

import { useActionState } from "react";

import type { PlayerPosition } from "@/config/player-positions";
import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";

import { createPlayer, type PlayerFormState } from "../actions/create-player";
import { updatePlayer } from "../actions/update-player";
import { describePlayersError, playersCopy } from "../copy";
import { PositionSelect } from "./position-select";

type EditablePlayer = { id: string; name: string; position: PlayerPosition };

type PlayerFormProps = { player?: EditablePlayer };

const NEW_PLAYER_DEFAULTS = { id: "", name: "", position: "MID" as const };

export function PlayerForm({ player }: PlayerFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<PlayerFormState, FormData>(
    player ? updatePlayer : createPlayer,
    null,
  );
  const { form } = playersCopy;
  const values = player ?? NEW_PLAYER_DEFAULTS;
  const submitLabel = player ? form.save : form.create;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {player ? <input type="hidden" name="playerId" value={player.id} /> : null}
      <TextField
        label={form.name}
        name="name"
        required
        maxLength={40}
        autoComplete="off"
        defaultValue={values.name}
      />
      <PositionSelect defaultValue={values.position} />
      <PlayerFormFeedback state={state} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? form.saving : submitLabel}
      </Button>
    </form>
  );
}

function PlayerFormFeedback({ state }: { state: PlayerFormState }): React.JSX.Element | null {
  if (!state) return null;
  if (!state.ok) {
    return (
      <p role="alert" className="text-sm font-bold text-hot">
        {describePlayersError(state.error)}
      </p>
    );
  }
  return (
    <p role="status" className="text-sm font-bold text-win">
      {playersCopy.form.saved}
    </p>
  );
}
