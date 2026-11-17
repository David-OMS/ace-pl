"use client";

import { useActionState } from "react";

import { FormFeedback } from "@/ui/form-feedback";

import { removeTeam, type RemoveTeamState } from "../actions/remove-team";
import { describeTeamsError, teamsCopy } from "../copy";

type RemoveTeamButtonProps = {
  tournamentId: string;
  teamId: string;
  teamName: string;
};

export function RemoveTeamButton({
  tournamentId,
  teamId,
  teamName,
}: RemoveTeamButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<RemoveTeamState, FormData>(
    removeTeam,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="teamId" value={teamId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={teamsCopy.removeTeam(teamName)}
        className="min-h-11 px-2 text-sm font-bold text-hazard underline disabled:opacity-50"
      >
        {teamsCopy.deleteTeam}
      </button>
      <FormFeedback error={state?.ok === false ? describeTeamsError(state.error) : null} />
    </form>
  );
}
