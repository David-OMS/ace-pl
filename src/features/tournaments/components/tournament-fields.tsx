import {
  TOURNAMENT_NAME_MAX_LENGTH,
  type FirstPlaceTiebreak,
  type KeeperMode,
} from "@/config/tournament-rules";
import { SelectField } from "@/ui/select-field";
import { TextField } from "@/ui/text-field";

import { tournamentsCopy } from "../copy";
import { KEEPER_MODE_OPTIONS, TIEBREAK_OPTIONS } from "../select-options";
import { TournamentDateFields } from "./tournament-date-fields";
import { TournamentSizeFields } from "./tournament-size-fields";

export type TournamentFieldValues = {
  name: string;
  startsOn: string;
  endsOn: string;
  playersOnPitch: number;
  squadSize: number;
  matchesPerGameDay: number;
  firstPlaceTiebreak: FirstPlaceTiebreak;
  keeperMode: KeeperMode;
};

export function TournamentFields({ values }: { values: TournamentFieldValues }): React.JSX.Element {
  const { form } = tournamentsCopy;

  return (
    <>
      <TextField
        label={form.name}
        name="name"
        required
        maxLength={TOURNAMENT_NAME_MAX_LENGTH}
        placeholder={form.namePlaceholder}
        defaultValue={values.name}
      />
      <TournamentDateFields startsOn={values.startsOn} endsOn={values.endsOn} />
      <TournamentSizeFields
        playersOnPitch={values.playersOnPitch}
        squadSize={values.squadSize}
        matchesPerGameDay={values.matchesPerGameDay}
      />
      <SelectField
        label={form.keeperMode}
        name="keeperMode"
        options={KEEPER_MODE_OPTIONS}
        defaultValue={values.keeperMode}
      />
      <SelectField
        label={form.firstPlaceTiebreak}
        name="firstPlaceTiebreak"
        options={TIEBREAK_OPTIONS}
        defaultValue={values.firstPlaceTiebreak}
      />
    </>
  );
}
