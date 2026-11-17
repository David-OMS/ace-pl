"use client";

import { RefreshCw } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";

import { resetClaimLink, type ResetClaimLinkState } from "../actions/reset-claim-link";
import { describePlayersError, playersCopy } from "../copy";

export function ResetClaimLinkForm({ playerId }: { playerId: string }): React.JSX.Element {
  const [state, resetAction, isResetting] = useActionState<ResetClaimLinkState, FormData>(
    resetClaimLink,
    null,
  );
  const copy = playersCopy.claimLink;

  return (
    <form action={resetAction} className="flex flex-col gap-1">
      <input type="hidden" name="playerId" value={playerId} />
      <Button type="submit" variant="secondary" fullWidth disabled={isResetting}>
        <Icon icon={RefreshCw} size="sm" />
        {isResetting ? copy.resetting : copy.reset}
      </Button>
      <p className="text-xs text-muted">{copy.resetHint}</p>
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describePlayersError(state.error)}
        </p>
      ) : null}
    </form>
  );
}
