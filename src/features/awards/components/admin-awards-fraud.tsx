"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { SelectField } from "@/ui/select-field";

import { addFraudWatch, type AddFraudWatchState } from "../actions/add-fraud-watch";
import { endFraudWatch, type EndFraudWatchState } from "../actions/end-fraud-watch";
import { awardsCopy } from "../copy";
import type { AwardsPlayerOption, FraudWatchRow } from "../queries/awards-admin-types";

type AdminAwardsFraudProps = {
  tournamentId: string;
  open: readonly FraudWatchRow[];
  history: readonly FraudWatchRow[];
  roster: readonly AwardsPlayerOption[];
};

// eslint-disable-next-line max-lines-per-function, complexity -- awards admin panel UI
export function AdminAwardsFraud({
  tournamentId,
  open,
  history,
  roster,
}: AdminAwardsFraudProps): React.JSX.Element {
  const [addState, addAction, addPending] = useActionState<AddFraudWatchState, FormData>(
    addFraudWatch,
    null,
  );
  const [endState, endAction, endPending] = useActionState<EndFraudWatchState, FormData>(
    endFraudWatch,
    null,
  );
  const openIds = new Set(open.map((r) => r.playerId));
  const options = roster
    .filter((p) => !openIds.has(p.id))
    .map((p) => ({ value: p.id, label: p.name }));

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">{awardsCopy.fraudTitle}</h2>
        <span className="text-xs font-bold text-muted">{awardsCopy.fraudHint}</span>
      </div>
      <div className="bg-[repeating-linear-gradient(-45deg,var(--color-hazard)_0_12px,var(--color-hazard-alt)_12px_24px)] p-2.5">
        {open.length === 0 ? (
          <p className="border-2 border-dashed border-line bg-surface px-3 py-3 text-sm text-muted">
            {awardsCopy.fraudEmpty}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {open.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-2 border-2 border-line bg-surface px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{row.playerName}</p>
                  {row.caption ? <p className="text-xs text-muted">{row.caption}</p> : null}
                </div>
                <form action={endAction}>
                  <input type="hidden" name="entryId" value={row.id} />
                  <Button type="submit" variant="secondary" disabled={endPending}>
                    {awardsCopy.endFraud}
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
      {open.length < 2 && options.length > 0 ? (
        <form action={addAction} className="flex flex-col gap-2">
          <input type="hidden" name="tournamentId" value={tournamentId} />
          <SelectField label={awardsCopy.pickPlayer} name="playerId" options={options} />
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold tracking-wide text-muted uppercase">
              {awardsCopy.captionLabel}
            </span>
            <input
              name="caption"
              className="min-h-11 border-2 border-line bg-surface px-3 text-sm"
            />
          </label>
          <Button type="submit" disabled={addPending}>
            {awardsCopy.fraudAdd}
          </Button>
        </form>
      ) : null}
      <FormFeedback
        error={
          addState && !addState.ok
            ? addState.error === "conflict"
              ? awardsCopy.fraudFull
              : awardsCopy.fraudSaveFailed
            : endState && !endState.ok
              ? awardsCopy.fraudSaveFailed
              : null
        }
        success={addState?.ok ? awardsCopy.fraudAdded : endState?.ok ? awardsCopy.fraudEnded : null}
      />
      {history.length > 0 ? (
        <p className="text-xs text-muted">Past: {history.map((h) => h.playerName).join(", ")}</p>
      ) : null}
    </section>
  );
}
