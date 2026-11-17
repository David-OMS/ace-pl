"use client";

import { useActionState } from "react";

import { MATCHES_PER_GAME_DAY, PLAYERS_ON_PITCH, SQUAD_SIZE } from "@/config/tournament-rules";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { saveTournament, type TournamentFormState } from "../actions/save-tournament";
import { describeTournamentsError, tournamentsCopy } from "../copy";
import type { TournamentDetail } from "../queries/get-tournament";
import { TournamentFields, type TournamentFieldValues } from "./tournament-fields";

type TournamentFormProps = { tournament?: TournamentDetail };

const NEW_TOURNAMENT_DEFAULTS: TournamentFieldValues = {
  name: "",
  startsOn: "",
  endsOn: "",
  playersOnPitch: PLAYERS_ON_PITCH.default,
  squadSize: SQUAD_SIZE.default,
  matchesPerGameDay: MATCHES_PER_GAME_DAY.default,
  firstPlaceTiebreak: "discipline",
  keeperMode: "shared",
};

function toFieldValues(tournament: TournamentDetail): TournamentFieldValues {
  return {
    name: tournament.name,
    startsOn: tournament.startsOn ?? "",
    endsOn: tournament.endsOn ?? "",
    playersOnPitch: tournament.playersOnPitch,
    squadSize: tournament.squadSize,
    matchesPerGameDay: tournament.matchesPerGameDay,
    firstPlaceTiebreak: tournament.firstPlaceTiebreak,
    keeperMode: tournament.keeperMode,
  };
}

export function TournamentForm({ tournament }: TournamentFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<TournamentFormState, FormData>(
    saveTournament,
    null,
  );
  const { form } = tournamentsCopy;
  const submitLabel = tournament ? form.save : form.create;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {tournament ? <input type="hidden" name="tournamentId" value={tournament.id} /> : null}
      <TournamentFields values={tournament ? toFieldValues(tournament) : NEW_TOURNAMENT_DEFAULTS} />
      <FormFeedback
        error={state?.ok === false ? describeTournamentsError(state.error) : null}
        success={state?.ok ? form.saved : null}
      />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? form.saving : submitLabel}
      </Button>
    </form>
  );
}
