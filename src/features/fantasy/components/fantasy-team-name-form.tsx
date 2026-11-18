"use client";

import { useActionState } from "react";

import { FANTASY_TEAM_NAME_MAX_CHANGES, FANTASY_TEAM_NAME_MAX_LENGTH } from "@/config/fantasy";
import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { renameFantasyTeam, type RenameFantasyTeamState } from "../actions/rename-fantasy-team";
import { fantasyCopy } from "../copy";
import { remainingFantasyNameChanges } from "../domain/fantasy-team-name";

type FantasyTeamNameFormProps = {
  teamId: string;
  currentName: string;
  nameChangeCount: number;
};

export function FantasyTeamNameForm({
  teamId,
  currentName,
  nameChangeCount,
}: FantasyTeamNameFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<RenameFantasyTeamState, FormData>(
    renameFantasyTeam,
    null,
  );
  useRefreshOnOk(state?.ok);
  const left = remainingFantasyNameChanges(nameChangeCount, FANTASY_TEAM_NAME_MAX_CHANGES);
  const locked = left === 0;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="teamId" value={teamId} />
      <TextField
        label={fantasyCopy.renameTeamLabel}
        name="name"
        defaultValue={currentName}
        maxLength={FANTASY_TEAM_NAME_MAX_LENGTH}
        required
        disabled={locked || isPending}
        hint={
          locked
            ? fantasyCopy.renameTeamExhausted
            : fantasyCopy.renameTeamHint(left, FANTASY_TEAM_NAME_MAX_CHANGES)
        }
      />
      {locked ? null : (
        <Button type="submit" disabled={isPending}>
          {isPending ? fantasyCopy.renamingTeam : fantasyCopy.renameTeamSave}
        </Button>
      )}
      <FormFeedback
        error={state?.ok === false ? fantasyCopy.errors[state.error] : null}
        success={state?.ok ? fantasyCopy.renameTeamSaved : null}
      />
    </form>
  );
}
