"use client";

import { X } from "lucide-react";
import { useActionState } from "react";

import { FormFeedback } from "@/ui/form-feedback";
import { Icon } from "@/ui/icon";

import { deleteFixture, type DeleteFixtureState } from "../actions/delete-fixture";
import { describeFixturesError, fixturesCopy } from "../copy";

type DeleteFixtureButtonProps = {
  tournamentId: string;
  fixtureId: string;
};

export function DeleteFixtureButton({
  tournamentId,
  fixtureId,
}: DeleteFixtureButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<DeleteFixtureState, FormData>(
    deleteFixture,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col items-end">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={fixturesCopy.remove}
        className="inline-flex size-11 items-center justify-center rounded-card text-muted disabled:opacity-50"
      >
        <Icon icon={X} size="sm" />
      </button>
      <FormFeedback error={state?.ok === false ? describeFixturesError(state.error) : null} />
    </form>
  );
}
