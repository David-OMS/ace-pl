"use client";

import { useActionState } from "react";

import type { ActionErrorCode } from "@/lib/action-result";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";

import { publishResult, type PublishResultState } from "../actions/publish-result";
import { recordWalkover, type RecordWalkoverState } from "../actions/record-walkover";
import { describeMatchesError, matchesCopy } from "../copy";

type MatchActionsBarProps = {
  tournamentId: string;
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
};

function firstError(
  publishState: PublishResultState,
  walkoverState: RecordWalkoverState,
): ActionErrorCode | null {
  if (publishState && !publishState.ok) return publishState.error;
  if (walkoverState && !walkoverState.ok) return walkoverState.error;
  return null;
}

export function MatchActionsBar(props: MatchActionsBarProps): React.JSX.Element {
  const [publishState, publishAction, isPublishing] = useActionState<PublishResultState, FormData>(
    publishResult,
    null,
  );
  const [walkoverState, walkoverAction, isWalkover] = useActionState<RecordWalkoverState, FormData>(
    recordWalkover,
    null,
  );
  const busy = isPublishing || isWalkover;
  const errorCode = firstError(publishState, walkoverState);

  return (
    <div className="flex flex-col gap-2">
      <form action={publishAction}>
        <input type="hidden" name="tournamentId" value={props.tournamentId} />
        <input type="hidden" name="fixtureId" value={props.fixtureId} />
        <Button type="submit" fullWidth disabled={busy}>
          {isPublishing ? matchesCopy.publishing : matchesCopy.publish}
        </Button>
      </form>
      <div className="grid grid-cols-2 gap-2">
        <WalkoverButton
          action={walkoverAction}
          tournamentId={props.tournamentId}
          fixtureId={props.fixtureId}
          winnerTeamId={props.homeTeamId}
          label={`${matchesCopy.walkover} ${props.homeTeamName}`}
          disabled={busy}
        />
        <WalkoverButton
          action={walkoverAction}
          tournamentId={props.tournamentId}
          fixtureId={props.fixtureId}
          winnerTeamId={props.awayTeamId}
          label={`${matchesCopy.walkover} ${props.awayTeamName}`}
          disabled={busy}
        />
      </div>
      <FormFeedback
        error={errorCode ? describeMatchesError(errorCode) : null}
        success={publishState?.ok || walkoverState?.ok ? matchesCopy.published : null}
      />
    </div>
  );
}

function WalkoverButton({
  action,
  tournamentId,
  fixtureId,
  winnerTeamId,
  label,
  disabled,
}: {
  action: (payload: FormData) => void;
  tournamentId: string;
  fixtureId: string;
  winnerTeamId: string;
  label: string;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <form action={action}>
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <input type="hidden" name="winnerTeamId" value={winnerTeamId} />
      <Button type="submit" variant="danger" fullWidth disabled={disabled}>
        {label}
      </Button>
    </form>
  );
}
