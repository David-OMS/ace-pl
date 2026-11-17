import { MATCHES_PER_GAME_DAY, PLAYERS_ON_PITCH, SQUAD_SIZE } from "@/config/tournament-rules";
import { TextField } from "@/ui/text-field";

import { tournamentsCopy } from "../copy";

type TournamentSizeFieldsProps = {
  playersOnPitch: number;
  squadSize: number;
  matchesPerGameDay: number;
};

export function TournamentSizeFields({
  playersOnPitch,
  squadSize,
  matchesPerGameDay,
}: TournamentSizeFieldsProps): React.JSX.Element {
  const { form } = tournamentsCopy;

  return (
    <>
      <TextField
        label={form.playersOnPitch}
        name="playersOnPitch"
        type="number"
        inputMode="numeric"
        min={PLAYERS_ON_PITCH.min}
        max={PLAYERS_ON_PITCH.max}
        required
        defaultValue={playersOnPitch}
      />
      <TextField
        label={form.squadSize}
        name="squadSize"
        type="number"
        inputMode="numeric"
        min={SQUAD_SIZE.min}
        max={SQUAD_SIZE.max}
        required
        defaultValue={squadSize}
      />
      <TextField
        label={form.matchesPerGameDay}
        name="matchesPerGameDay"
        type="number"
        inputMode="numeric"
        min={MATCHES_PER_GAME_DAY.min}
        max={MATCHES_PER_GAME_DAY.max}
        required
        defaultValue={matchesPerGameDay}
      />
    </>
  );
}
