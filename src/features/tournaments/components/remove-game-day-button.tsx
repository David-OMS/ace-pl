"use client";

import { X } from "lucide-react";
import { useActionState } from "react";

import { FormFeedback } from "@/ui/form-feedback";
import { Icon } from "@/ui/icon";

import { removeGameDay, type GameDayState } from "../actions/manage-game-days";
import { describeTournamentsError, tournamentsCopy } from "../copy";

type RemoveGameDayButtonProps = { tournamentId: string; gameDayId: string; dateLabel: string };

function errorMessage(state: GameDayState): string | null {
  if (!state || state.ok) return null;
  if (state.error === "save_failed") return tournamentsCopy.gameDays.removeBlocked;
  return describeTournamentsError(state.error);
}

export function RemoveGameDayButton({
  tournamentId,
  gameDayId,
  dateLabel,
}: RemoveGameDayButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<GameDayState, FormData>(
    removeGameDay,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col items-end">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="gameDayId" value={gameDayId} />
      <button
        type="submit"
        disabled={isPending}
        aria-label={tournamentsCopy.gameDays.remove(dateLabel)}
        className="inline-flex size-11 items-center justify-center rounded-card text-muted disabled:opacity-50"
      >
        <Icon icon={X} size="sm" />
      </button>
      <FormFeedback error={errorMessage(state)} />
    </form>
  );
}
