"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { deleteTournament, type DeleteTournamentState } from "../actions/delete-tournament";
import { describeTournamentsError, tournamentsCopy } from "../copy";

type DeleteTournamentButtonProps = { tournamentId: string };

export function DeleteTournamentButton({
  tournamentId,
}: DeleteTournamentButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<DeleteTournamentState, FormData>(
    deleteTournament,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <p className="text-sm text-muted">{tournamentsCopy.deleteTournamentHint}</p>
      <FormFeedback error={state?.ok === false ? describeTournamentsError(state.error) : null} />
      <Button type="submit" variant="danger" fullWidth disabled={isPending}>
        {isPending ? tournamentsCopy.deletingTournament : tournamentsCopy.deleteTournament}
      </Button>
    </form>
  );
}
