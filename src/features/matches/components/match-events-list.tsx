"use client";

import { useActionState, useTransition } from "react";

import { FormFeedback } from "@/ui/form-feedback";

import { removeMatchEvent, type RemoveMatchEventState } from "../actions/remove-match-event";
import { describeMatchesError, matchesCopy } from "../copy";
import type { MatchEventRow } from "../queries/get-match-entry";

type MatchEventsListProps = {
  tournamentId: string;
  fixtureId: string;
  events: readonly MatchEventRow[];
  locked: boolean;
};

export function MatchEventsList({
  tournamentId,
  fixtureId,
  events,
  locked,
}: MatchEventsListProps): React.JSX.Element {
  if (events.length === 0) {
    return <p className="text-sm text-muted">{matchesCopy.noEvents}</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line-soft">
      {events.map((event) => (
        <EventRow
          key={event.id}
          tournamentId={tournamentId}
          fixtureId={fixtureId}
          event={event}
          locked={locked}
        />
      ))}
    </ul>
  );
}

function EventRow({
  tournamentId,
  fixtureId,
  event,
  locked,
}: {
  tournamentId: string;
  fixtureId: string;
  event: MatchEventRow;
  locked: boolean;
}): React.JSX.Element {
  const [state, formAction] = useActionState<RemoveMatchEventState, FormData>(
    removeMatchEvent,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const detail =
    event.eventType === "saves"
      ? `${event.quantity}`
      : event.assistPlayerName
        ? `· ${event.assistPlayerName}`
        : "";

  return (
    <li className="flex items-center gap-2 py-2 text-sm">
      <span className="w-24 font-bold uppercase">{matchesCopy.eventTypes[event.eventType]}</span>
      <span className="flex-1 font-bold">
        {event.playerName} {detail}
      </span>
      {locked ? null : (
        <button
          type="button"
          disabled={isPending}
          className="min-h-11 px-2 text-xs font-bold text-hot underline disabled:opacity-50"
          onClick={() => {
            const formData = new FormData();
            formData.set("eventId", event.id);
            formData.set("tournamentId", tournamentId);
            formData.set("fixtureId", fixtureId);
            startTransition(() => formAction(formData));
          }}
        >
          {matchesCopy.form.remove}
        </button>
      )}
      <FormFeedback error={state?.ok === false ? describeMatchesError(state.error) : null} />
    </li>
  );
}
