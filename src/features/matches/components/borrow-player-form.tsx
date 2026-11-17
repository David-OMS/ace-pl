"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { SelectField } from "@/ui/select-field";

import { borrowPlayer, type BorrowPlayerState } from "../actions/borrow-player";
import { describeMatchesError, matchesCopy } from "../copy";

type BorrowPlayerFormProps = {
  tournamentId: string;
  fixtureId: string;
  teamId: string;
  pool: readonly { id: string; name: string }[];
};

export function BorrowPlayerForm({
  tournamentId,
  fixtureId,
  teamId,
  pool,
}: BorrowPlayerFormProps): React.JSX.Element | null {
  const [state, formAction, isPending] = useActionState<BorrowPlayerState, FormData>(
    borrowPlayer,
    null,
  );
  if (pool.length === 0) return null;

  const options = pool.map((player) => ({ value: player.id, label: player.name }));

  return (
    <form action={formAction} className="flex flex-col gap-2 border-t border-line-soft pt-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <input type="hidden" name="teamId" value={teamId} />
      <SelectField
        label={matchesCopy.borrow}
        name="playerId"
        options={options}
        defaultValue={options[0]?.value ?? ""}
        required
      />
      <FormFeedback error={state?.ok === false ? describeMatchesError(state.error) : null} />
      <Button type="submit" variant="secondary" disabled={isPending}>
        {matchesCopy.borrowSubmit}
      </Button>
    </form>
  );
}
