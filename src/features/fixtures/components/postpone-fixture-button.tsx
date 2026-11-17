"use client";

import { useActionState, useState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { postponeFixture, type PostponeFixtureState } from "../actions/postpone-fixture";
import { describeFixturesError, fixturesCopy } from "../copy";

type PostponeFixtureButtonProps = {
  tournamentId: string;
  fixtureId: string;
};

export function PostponeFixtureButton({
  tournamentId,
  fixtureId,
}: PostponeFixtureButtonProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<PostponeFixtureState, FormData>(
    postponeFixture,
    null,
  );

  if (!open) {
    return (
      <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(true)}>
        {fixturesCopy.postpone}
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-2 border-2 border-line bg-surface p-3"
    >
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <TextField
        label={fixturesCopy.postponeDate}
        name="playedOn"
        type="date"
        hint={fixturesCopy.postponeDateHint}
      />
      <TextField label={fixturesCopy.postponeTime} name="kickoffTime" type="time" />
      <FormFeedback error={state?.ok === false ? describeFixturesError(state.error) : null} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? fixturesCopy.postponing : fixturesCopy.confirmPostpone}
      </Button>
      <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(false)}>
        {fixturesCopy.cancelPostpone}
      </Button>
    </form>
  );
}
