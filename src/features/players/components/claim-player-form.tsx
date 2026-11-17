"use client";

import { Link2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";

import { claimPlayer, type ClaimPlayerState } from "../actions/claim-player";
import { describePlayersError, playersCopy } from "../copy";

type ClaimPlayerFormProps = { token: string };

export function ClaimPlayerForm({ token }: ClaimPlayerFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<ClaimPlayerState, FormData>(
    claimPlayer,
    null,
  );
  const copy = playersCopy.claimPage;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describePlayersError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        <Icon icon={Link2} size="sm" />
        {isPending ? copy.linking : copy.confirm}
      </Button>
    </form>
  );
}
