"use client";

import { useActionState } from "react";

import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { FormFeedback } from "@/ui/form-feedback";

import { setCaptain, type SetCaptainState } from "../actions/set-captain";
import { describeTeamsError, teamsCopy } from "../copy";

type MakeCaptainButtonProps = {
  tournamentId: string;
  teamId: string;
  playerId: string;
  isCaptain: boolean;
};

export function MakeCaptainButton({
  tournamentId,
  teamId,
  playerId,
  isCaptain,
}: MakeCaptainButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<SetCaptainState, FormData>(
    setCaptain,
    null,
  );
  useRefreshOnOk(state?.ok);

  if (isCaptain) {
    return <span className="text-xs font-bold text-accent uppercase">{teamsCopy.captain}</span>;
  }

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
        {teamsCopy.makeCaptain}
      </button>
      <FormFeedback error={state?.ok === false ? describeTeamsError(state.error) : null} />
    </form>
  );
}
