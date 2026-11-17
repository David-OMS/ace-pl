"use client";

import { useActionState, useState } from "react";
import type { Route } from "next";

import { TEAM_NAME_MAX_LENGTH } from "@/config/tournament-rules";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { FormFeedback } from "@/ui/form-feedback";
import { PageHeader } from "@/ui/page-header";
import { TextField } from "@/ui/text-field";

import { createTeam, type CreateTeamState } from "../actions/create-team";
import { describeTeamsError, teamsCopy } from "../copy";
import { PlayerMultiPicker, type PickablePlayer } from "./player-multi-picker";

type CreateTeamScreenProps = {
  tournamentId: string;
  tournamentName: string;
  squadSize: number;
  availablePlayers: readonly PickablePlayer[];
  backHref: Route;
};

export function CreateTeamScreen(props: CreateTeamScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={teamsCopy.createTitle}
        back={{ href: props.backHref, label: props.tournamentName }}
      />
      <Card className="flex flex-col gap-3">
        <CreateTeamForm {...props} />
      </Card>
    </main>
  );
}

function CreateTeamForm({
  tournamentId,
  squadSize,
  availablePlayers,
}: CreateTeamScreenProps): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [state, formAction, isPending] = useActionState<CreateTeamState, FormData>(
    createTeam,
    null,
  );
  const { form } = teamsCopy;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="playerIds" value={id} />
      ))}
      <TextField
        label={form.name}
        name="name"
        required
        maxLength={TEAM_NAME_MAX_LENGTH}
        placeholder={form.namePlaceholder}
        autoComplete="off"
      />
      <PlayerMultiPicker
        players={availablePlayers}
        selectedIds={selected}
        maxSelectable={squadSize}
        onChange={setSelected}
      />
      <FormFeedback error={state?.ok === false ? describeTeamsError(state.error) : null} />
      <Button type="submit" name="next" value="another" fullWidth disabled={isPending}>
        {isPending ? form.adding : teamsCopy.saveAndAnother}
      </Button>
      <Button
        type="submit"
        name="next"
        value="hub"
        variant="secondary"
        fullWidth
        disabled={isPending}
      >
        {teamsCopy.saveAndDone}
      </Button>
    </form>
  );
}
