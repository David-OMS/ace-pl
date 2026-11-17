"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { generateFixtures, type GenerateFixturesState } from "../actions/generate-fixtures";
import { describeFixturesError, fixturesCopy } from "../copy";

type GenerateFixturesButtonProps = {
  tournamentId: string;
  hasExisting: boolean;
};

export function GenerateFixturesButton({
  tournamentId,
  hasExisting,
}: GenerateFixturesButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<GenerateFixturesState, FormData>(
    generateFixtures,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <p className="text-sm text-muted">
        {hasExisting ? fixturesCopy.generateHintFill : fixturesCopy.generateHintEmpty}
      </p>
      <FormFeedback error={state?.ok === false ? describeFixturesError(state.error) : null} />
      <Button type="submit" variant="secondary" fullWidth disabled={isPending}>
        {isPending
          ? fixturesCopy.generating
          : hasExisting
            ? fixturesCopy.generateFill
            : fixturesCopy.generateAll}
      </Button>
    </form>
  );
}
