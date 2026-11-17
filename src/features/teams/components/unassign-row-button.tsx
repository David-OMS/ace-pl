"use client";

import { useActionState } from "react";

import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { FormFeedback } from "@/ui/form-feedback";

import { unassignPlayer, type UnassignPlayerState } from "../actions/unassign-player";
import { describeTeamsError, teamsCopy } from "../copy";

type UnassignRowButtonProps = {
  tournamentId: string;
  teamId: string;
  playerId: string;
};

export function UnassignRowButton({
  tournamentId,
  teamId,
  playerId,
}: UnassignRowButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UnassignPlayerState, FormData>(
    unassignPlayer,
    null,
  );
  useRefreshOnOk(state?.ok);

  return (
    <form action={formAction} className="flex flex-col items-end">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="playerId" value={playerId} />
      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 px-1 text-xs font-bold text-muted underline disabled:opacity-50"
      >
        {teamsCopy.removeFromTeam}
      </button>
      <FormFeedback error={state?.ok === false ? describeTeamsError(state.error) : null} />
    </form>
  );
}
