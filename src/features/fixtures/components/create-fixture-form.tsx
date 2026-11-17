"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { createFixture, type CreateFixtureState } from "../actions/create-fixture";
import { describeFixturesError, fixturesCopy } from "../copy";
import { FixtureMatchFields } from "./fixture-match-fields";

type TeamOption = { id: string; name: string };
type GameDayOption = { id: string; label: string };

type CreateFixtureFormProps = {
  tournamentId: string;
  teams: readonly TeamOption[];
  gameDays: readonly GameDayOption[];
};

export function CreateFixtureForm({
  tournamentId,
  teams,
  gameDays,
}: CreateFixtureFormProps): React.JSX.Element | null {
  const [state, formAction, isPending] = useActionState<CreateFixtureState, FormData>(
    createFixture,
    null,
  );
  const { form } = fixturesCopy;

  if (teams.length < 2 || gameDays.length === 0) return null;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <FixtureMatchFields
        teamOptions={teams.map((team) => ({ value: team.id, label: team.name }))}
        dayOptions={gameDays.map((day) => ({ value: day.id, label: day.label }))}
      />
      <FormFeedback error={state?.ok === false ? describeFixturesError(state.error) : null} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? form.adding : form.add}
      </Button>
    </form>
  );
}
