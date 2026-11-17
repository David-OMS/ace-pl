"use client";

import { useActionState, useTransition } from "react";

import { FormFeedback } from "@/ui/form-feedback";
import { SelectField } from "@/ui/select-field";

import { assignPlayer, type AssignPlayerState } from "../actions/assign-player";
import { unassignPlayer, type UnassignPlayerState } from "../actions/unassign-player";
import { describeTeamsError, teamsCopy } from "../copy";
import type { TeamRef } from "../domain/build-squads";

const UNASSIGNED_VALUE = "__unassigned__";

type AssignPlayerSelectProps = {
  tournamentId: string;
  playerId: string;
  currentTeamId: string | null;
  teams: readonly TeamRef[];
};

export function AssignPlayerSelect({
  tournamentId,
  playerId,
  currentTeamId,
  teams,
}: AssignPlayerSelectProps): React.JSX.Element {
  const [assignState, assignAction] = useActionState<AssignPlayerState, FormData>(
    assignPlayer,
    null,
  );
  const [unassignState, unassignAction] = useActionState<UnassignPlayerState, FormData>(
    unassignPlayer,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const errorState = assignState?.ok === false ? assignState : unassignState;

  return (
    <div className="flex min-w-36 flex-col items-stretch gap-1">
      <SelectField
        label={teamsCopy.assign.label}
        hideLabel
        options={teamOptions(teams, currentTeamId)}
        value={currentTeamId ?? ""}
        onChange={(teamId) =>
          startTransition(() =>
            movePlayer({
              teamId,
              tournamentId,
              playerId,
              currentTeamId,
              assignAction,
              unassignAction,
            }),
          )
        }
        disabled={isPending || teams.length === 0}
        placeholder={teamsCopy.assign.label}
      />
      {isPending ? <span className="text-xs text-muted">{teamsCopy.assign.saving}</span> : null}
      <FormFeedback
        error={errorState?.ok === false ? describeTeamsError(errorState.error) : null}
      />
    </div>
  );
}

function teamOptions(
  teams: readonly TeamRef[],
  currentTeamId: string | null,
): { value: string; label: string }[] {
  return [
    ...(currentTeamId ? [{ value: UNASSIGNED_VALUE, label: teamsCopy.assign.none }] : []),
    ...teams.map((team) => ({ value: team.id, label: team.name })),
  ];
}

function movePlayer(input: {
  teamId: string;
  tournamentId: string;
  playerId: string;
  currentTeamId: string | null;
  assignAction: (formData: FormData) => void;
  unassignAction: (formData: FormData) => void;
}): void {
  if (!input.teamId || input.teamId === input.currentTeamId) return;
  const formData = new FormData();
  formData.set("tournamentId", input.tournamentId);
  formData.set("playerId", input.playerId);
  if (input.teamId === UNASSIGNED_VALUE) {
    input.unassignAction(formData);
    return;
  }
  formData.set("teamId", input.teamId);
  input.assignAction(formData);
}
