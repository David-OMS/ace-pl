"use client";

import { CalendarPlus } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { Icon } from "@/ui/icon";
import { TextField } from "@/ui/text-field";

import { addGameDay, type GameDayState } from "../actions/manage-game-days";
import { describeTournamentsError, tournamentsCopy } from "../copy";

export function AddGameDayForm({ tournamentId }: { tournamentId: string }): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<GameDayState, FormData>(addGameDay, null);
  const copy = tournamentsCopy.gameDays;

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <TextField label={copy.dateLabel} name="playedOn" type="date" required />
        </div>
        <Button type="submit" disabled={isPending}>
          <Icon icon={CalendarPlus} size="sm" />
          {copy.add}
        </Button>
      </div>
      <FormFeedback error={state?.ok === false ? describeTournamentsError(state.error) : null} />
    </form>
  );
}
