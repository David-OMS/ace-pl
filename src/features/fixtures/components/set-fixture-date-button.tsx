"use client";

import { useActionState, useState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { setFixtureDate, type SetFixtureDateState } from "../actions/set-fixture-date";
import { describeFixturesError, fixturesCopy } from "../copy";

type SetFixtureDateButtonProps = {
  tournamentId: string;
  fixtureId: string;
};

export function SetFixtureDateButton({
  tournamentId,
  fixtureId,
}: SetFixtureDateButtonProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<SetFixtureDateState, FormData>(
    setFixtureDate,
    null,
  );

  if (!open) {
    return (
      <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(true)}>
        {fixturesCopy.setDate}
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
      <TextField label={fixturesCopy.setDateLabel} name="playedOn" type="date" required />
      <TextField label={fixturesCopy.setTimeLabel} name="kickoffTime" type="time" required />
      <FormFeedback error={state?.ok === false ? describeFixturesError(state.error) : null} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? fixturesCopy.settingDate : fixturesCopy.confirmSetDate}
      </Button>
      <Button type="button" variant="secondary" fullWidth onClick={() => setOpen(false)}>
        {fixturesCopy.cancelPostpone}
      </Button>
    </form>
  );
}
