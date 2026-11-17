"use client";

import { useActionState, useState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { addMatchEvent, type AddMatchEventState } from "../actions/add-match-event";
import { describeMatchesError, matchesCopy } from "../copy";
import { EventFields, type EventPlayerOption } from "./event-fields";

type AddEventFormProps = {
  tournamentId: string;
  fixtureId: string;
  players: readonly EventPlayerOption[];
};

export function AddEventForm({
  tournamentId,
  fixtureId,
  players,
}: AddEventFormProps): React.JSX.Element | null {
  const [state, formAction, isPending] = useActionState<AddMatchEventState, FormData>(
    addMatchEvent,
    null,
  );
  const [eventType, setEventType] = useState("goal");
  if (players.length === 0) return null;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <EventFields eventType={eventType} onEventTypeChange={setEventType} players={players} />
      <FormFeedback error={state?.ok === false ? describeMatchesError(state.error) : null} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? matchesCopy.form.adding : matchesCopy.form.add}
      </Button>
    </form>
  );
}
