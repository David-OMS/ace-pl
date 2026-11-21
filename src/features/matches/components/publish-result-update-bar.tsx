"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import {
  publishResultUpdate,
  type PublishResultUpdateState,
} from "../actions/publish-result-update";
import { describeMatchesError, matchesCopy } from "../copy";

type PublishResultUpdateBarProps = {
  tournamentId: string;
  fixtureId: string;
};

export function PublishResultUpdateBar({
  tournamentId,
  fixtureId,
}: PublishResultUpdateBarProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<PublishResultUpdateState, FormData>(
    publishResultUpdate,
    null,
  );

  return (
    <div className="flex flex-col gap-2">
      <form action={formAction}>
        <input type="hidden" name="tournamentId" value={tournamentId} />
        <input type="hidden" name="fixtureId" value={fixtureId} />
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? matchesCopy.publishingUpdate : matchesCopy.publishUpdate}
        </Button>
      </form>
      <FormFeedback
        error={state && !state.ok ? describeMatchesError(state.error) : null}
        success={state?.ok ? matchesCopy.updated : null}
      />
    </div>
  );
}
