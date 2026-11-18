"use client";

import { useActionState, useTransition } from "react";

import { FormFeedback } from "@/ui/form-feedback";

import { setParticipation, type SetParticipationState } from "../actions/set-participation";
import { describeMatchesError, matchesCopy } from "../copy";
import type { MatchPlayer } from "../queries/get-match-entry";

type ParticipationRowProps = {
  tournamentId: string;
  fixtureId: string;
  player: MatchPlayer;
  locked: boolean;
};

export function ParticipationRow({
  tournamentId,
  fixtureId,
  player,
  locked,
}: ParticipationRowProps): React.JSX.Element {
  const [state, formAction] = useActionState<SetParticipationState, FormData>(
    setParticipation,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const isAbsent = player.status === "absent";

  function toggleAbsent(): void {
    if (locked || isPending) return;
    const formData = new FormData();
    formData.set("participationId", player.participationId);
    formData.set("tournamentId", tournamentId);
    formData.set("fixtureId", fixtureId);
    formData.set("status", isAbsent ? "played" : "absent");
    startTransition(() => formAction(formData));
  }

  return (
    <li className="flex flex-col gap-1 py-1">
      <button
        type="button"
        disabled={locked || isPending}
        onClick={toggleAbsent}
        className={`flex min-h-11 w-full items-center gap-2 border-2 px-2 text-left text-sm font-bold disabled:opacity-50 ${
          isAbsent
            ? "border-dashed border-line bg-canvas text-muted line-through opacity-40"
            : "border-line bg-surface"
        }`}
      >
        <span className="bg-surface-alt px-1 py-0.5 text-[9px] font-extrabold tracking-wide">
          {player.position}
        </span>
        <span className="flex-1 truncate">{player.name}</span>
        <PlayerTags player={player} />
      </button>
      <FormFeedback error={state?.ok === false ? describeMatchesError(state.error) : null} />
    </li>
  );
}

function PlayerTags({ player }: { player: MatchPlayer }): React.JSX.Element {
  return (
    <>
      {player.isCaptain ? (
        <span className="text-xs font-bold text-accent" title={matchesCopy.captain}>
          {matchesCopy.captainMark}
        </span>
      ) : null}
      {player.isBorrowed ? (
        <span className="bg-hot px-1 py-0.5 text-[8px] font-extrabold text-on-hot uppercase">
          {matchesCopy.loan}
        </span>
      ) : null}
      {player.isGoalkeeper ? (
        <span className="text-xs font-bold text-accent" title={matchesCopy.keeper}>
          GK
        </span>
      ) : null}
    </>
  );
}
