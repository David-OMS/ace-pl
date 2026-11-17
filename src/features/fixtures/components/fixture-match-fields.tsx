"use client";

import { SelectField, type SelectOption } from "@/ui/select-field";
import { TextField } from "@/ui/text-field";

import { fixturesCopy } from "../copy";

type FixtureMatchFieldsProps = {
  teamOptions: readonly SelectOption[];
  dayOptions: readonly SelectOption[];
};

export function FixtureMatchFields({
  teamOptions,
  dayOptions,
}: FixtureMatchFieldsProps): React.JSX.Element {
  const { form } = fixturesCopy;

  return (
    <>
      <SelectField
        label={form.gameDay}
        name="gameDayId"
        options={dayOptions}
        defaultValue={dayOptions[0]?.value ?? ""}
        required
      />
      <SelectField
        label={form.homeTeam}
        name="homeTeamId"
        options={teamOptions}
        defaultValue={teamOptions[0]?.value ?? ""}
        required
      />
      <SelectField
        label={form.awayTeam}
        name="awayTeamId"
        options={teamOptions}
        defaultValue={teamOptions[1]?.value ?? teamOptions[0]?.value ?? ""}
        required
      />
      <TextField
        label={form.kickoffTime}
        name="kickoffTime"
        type="time"
        required
        defaultValue="19:00"
      />
    </>
  );
}
