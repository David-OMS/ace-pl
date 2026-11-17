"use client";

import { useState } from "react";

import { SelectField } from "@/ui/select-field";
import { TextField } from "@/ui/text-field";

import { matchesCopy } from "../copy";
import { EVENT_TYPE_OPTIONS } from "../select-options";

export type EventPlayerOption = {
  id: string;
  name: string;
  teamId: string;
};

type EventFieldsProps = {
  eventType: string;
  onEventTypeChange: (value: string) => void;
  players: readonly EventPlayerOption[];
};

// eslint-disable-next-line max-lines-per-function -- event type field branches
export function EventFields({
  eventType,
  onEventTypeChange,
  players,
}: EventFieldsProps): React.JSX.Element {
  const { form } = matchesCopy;
  const [playerId, setPlayerId] = useState(players[0]?.id ?? "");
  const scorer = players.find((p) => p.id === playerId);
  const playerOptions = players.map((p) => ({ value: p.id, label: p.name }));
  const assistOptions = [
    { value: "", label: form.assistNone },
    ...players
      .filter((p) => p.teamId === scorer?.teamId && p.id !== playerId)
      .map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <>
      <SelectField
        label={form.type}
        name="eventType"
        options={EVENT_TYPE_OPTIONS}
        value={eventType}
        onChange={onEventTypeChange}
      />
      <SelectField
        label={form.player}
        name="playerId"
        options={playerOptions}
        value={playerId}
        onChange={setPlayerId}
        required
      />
      {eventType === "goal" ? (
        <SelectField
          key={`assist-${playerId}`}
          label={form.assist}
          name="assistPlayerId"
          options={assistOptions}
          defaultValue=""
        />
      ) : null}
      {eventType === "saves" ? (
        <TextField
          label={form.saves}
          name="quantity"
          type="number"
          min={1}
          max={50}
          defaultValue={1}
        />
      ) : null}
    </>
  );
}
