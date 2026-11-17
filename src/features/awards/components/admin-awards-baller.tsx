"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { FormFeedback } from "@/ui/form-feedback";

import { openBallonVoting, type OpenBallonVotingState } from "../actions/open-ballon-voting";
import { awardsCopy } from "../copy";
import type { BallonRoundView } from "../queries/awards-admin-types";

type AdminAwardsBallerProps = {
  tournamentId: string;
  tournamentName: string;
  preview: readonly { playerId: string; name: string; statsScore: number }[];
  ballon: BallonRoundView | null;
};

// eslint-disable-next-line max-lines-per-function, complexity -- awards admin panel UI
export function AdminAwardsBaller({
  tournamentId,
  tournamentName,
  preview,
  ballon,
}: AdminAwardsBallerProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<OpenBallonVotingState, FormData>(
    openBallonVoting,
    null,
  );
  const status = ballon?.status ?? "closed";
  const list = ballon?.shortlist.length ? ballon.shortlist : preview;
  const statusLabel =
    status === "open"
      ? awardsCopy.statusOpen
      : status === "revealed"
        ? awardsCopy.statusRevealed
        : awardsCopy.statusClosed;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">{awardsCopy.ballerTitle}</h2>
        <span className="border border-line bg-surface-alt px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase">
          {statusLabel}
        </span>
      </div>
      <Card className="flex flex-col gap-2">
        <p className="text-[11px] font-extrabold tracking-wide text-muted uppercase">
          {awardsCopy.ballerShortlist}
        </p>
        {list.length === 0 ? (
          <p className="text-sm text-muted">{awardsCopy.ballerEmpty}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {list.map((row) => (
              <li key={row.playerId} className="flex justify-between text-sm">
                <span className="font-bold">{row.name}</span>
                <span className="text-muted">{row.statsScore}</span>
              </li>
            ))}
          </ul>
        )}
        {ballon?.status === "open" ? (
          <p className="text-xs text-muted">{awardsCopy.votesCast(ballon.voteCount)}</p>
        ) : null}
        {status === "closed" || status === "revealed" ? (
          <form action={formAction} className="flex flex-col gap-2 pt-2">
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <input type="hidden" name="tournamentName" value={tournamentName} />
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold tracking-wide text-muted uppercase">
                {awardsCopy.votingDeadline}
              </span>
              <input
                type="datetime-local"
                name="votingClosesAt"
                required
                className="min-h-11 border-2 border-line bg-surface px-3 text-sm font-semibold"
              />
            </label>
            <Button type="submit" disabled={isPending || preview.length === 0}>
              {awardsCopy.openVoting}
            </Button>
          </form>
        ) : null}
        <FormFeedback
          error={state && !state.ok ? awardsCopy.shortlistEmpty : null}
          success={state?.ok ? awardsCopy.votingOpened : null}
        />
        <p className="text-xs text-muted">{awardsCopy.ballerHint}</p>
      </Card>
    </section>
  );
}
