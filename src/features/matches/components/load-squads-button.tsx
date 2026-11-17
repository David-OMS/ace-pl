"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { loadSquads, type LoadSquadsState } from "../actions/load-squads";
import { describeMatchesError, matchesCopy } from "../copy";

export function LoadSquadsButton({ fixtureId }: { fixtureId: string }): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<LoadSquadsState, FormData>(
    loadSquads,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <Button type="submit" variant="secondary" fullWidth disabled={isPending}>
        {isPending ? matchesCopy.loadingSquads : matchesCopy.loadSquads}
      </Button>
      <FormFeedback error={state?.ok === false ? describeMatchesError(state.error) : null} />
    </form>
  );
}
