"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { FormFeedback } from "@/ui/form-feedback";
import { SelectField } from "@/ui/select-field";

import {
  addSharedKeeper,
  removeSharedKeeper,
  type SharedKeeperState,
} from "../actions/manage-shared-keepers";
import { describeTournamentsError, tournamentsCopy } from "../copy";
import type { SharedKeeper } from "../queries/get-tournament";

type SharedKeepersPanelProps = {
  tournamentId: string;
  keepers: readonly SharedKeeper[];
  candidates: readonly { id: string; name: string }[];
};

export function SharedKeepersPanel({
  tournamentId,
  keepers,
  candidates,
}: SharedKeepersPanelProps): React.JSX.Element {
  const copy = tournamentsCopy.sharedKeepers;

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{copy.title}</h2>
      <p className="text-sm text-muted">{copy.hint}</p>
      {keepers.length === 0 ? (
        <p className="text-sm text-muted">{copy.empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft">
          {keepers.map((keeper) => (
            <KeeperRow key={keeper.playerId} tournamentId={tournamentId} keeper={keeper} />
          ))}
        </ul>
      )}
      {candidates.length > 0 ? (
        <AddKeeperForm tournamentId={tournamentId} candidates={candidates} />
      ) : null}
    </Card>
  );
}

function KeeperRow({
  tournamentId,
  keeper,
}: {
  tournamentId: string;
  keeper: SharedKeeper;
}): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<SharedKeeperState, FormData>(
    removeSharedKeeper,
    null,
  );

  return (
    <li className="flex flex-col gap-1 py-2">
      <div className="flex items-center gap-2">
        <span className="flex-1 font-bold">{keeper.name}</span>
        <form action={formAction}>
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <input type="hidden" name="playerId" value={keeper.playerId} />
          <Button type="submit" variant="secondary" disabled={isPending}>
            {tournamentsCopy.sharedKeepers.remove}
          </Button>
        </form>
      </div>
      <FormFeedback error={state?.ok === false ? describeTournamentsError(state.error) : null} />
    </li>
  );
}

function AddKeeperForm({
  tournamentId,
  candidates,
}: {
  tournamentId: string;
  candidates: readonly { id: string; name: string }[];
}): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<SharedKeeperState, FormData>(
    addSharedKeeper,
    null,
  );
  const options = candidates.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <SelectField
        label={tournamentsCopy.sharedKeepers.pick}
        name="playerId"
        options={options}
        defaultValue={options[0]?.value ?? ""}
        required
      />
      <FormFeedback error={state?.ok === false ? describeTournamentsError(state.error) : null} />
      <Button type="submit" variant="secondary" disabled={isPending}>
        {tournamentsCopy.sharedKeepers.add}
      </Button>
    </form>
  );
}
