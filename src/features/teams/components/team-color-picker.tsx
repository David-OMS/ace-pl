"use client";

import { useActionState } from "react";

import { TEAM_COLOR_PALETTE } from "@/config/team-colors";
import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { FormFeedback } from "@/ui/form-feedback";

import { updateTeamColor, type UpdateTeamColorState } from "../actions/update-team-color";
import { describeTeamsError, teamsCopy } from "../copy";

type TeamColorPickerProps = {
  tournamentId: string;
  teamId: string;
  color: string;
};

export function TeamColorPicker({
  tournamentId,
  teamId,
  color,
}: TeamColorPickerProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UpdateTeamColorState, FormData>(
    updateTeamColor,
    null,
  );
  useRefreshOnOk(state?.ok);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="teamId" value={teamId} />
      <p className="text-xs font-extrabold tracking-wide text-muted uppercase">
        {teamsCopy.kitColor}
      </p>
      <div className="flex flex-wrap gap-2">
        {TEAM_COLOR_PALETTE.map((swatch) => (
          <button
            key={swatch}
            type="submit"
            name="color"
            value={swatch}
            disabled={isPending}
            aria-label={teamsCopy.kitColorOption(swatch)}
            className={`size-9 border-2 border-line disabled:opacity-50 ${
              color.toLowerCase() === swatch.toLowerCase() ? "shadow-offset-sm" : ""
            }`}
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
      <FormFeedback error={state?.ok === false ? describeTeamsError(state.error) : null} />
    </form>
  );
}
