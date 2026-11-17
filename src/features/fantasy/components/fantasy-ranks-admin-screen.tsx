"use client";

import type { Route } from "next";
import { useActionState } from "react";

import { FANTASY_RANKS } from "@/config/fantasy";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { PageHeader } from "@/ui/page-header";
import { SelectField } from "@/ui/select-field";

import { upsertFantasyRank, type UpsertFantasyRankState } from "../actions/upsert-fantasy-rank";
import { fantasyCopy } from "../copy";
import type { PickablePlayer } from "../queries/list-pickable-players";

type FantasyRanksAdminScreenProps = {
  tournamentId: string;
  tournamentName: string;
  backHref: Route;
  players: readonly PickablePlayer[];
};

export function FantasyRanksAdminScreen({
  tournamentId,
  tournamentName,
  backHref,
  players,
}: FantasyRanksAdminScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader
        title={fantasyCopy.adminRanksTitle}
        back={{
          href: backHref,
          label: tournamentName,
        }}
      />
      <p className="text-sm text-muted">{fantasyCopy.adminRanksHint}</p>
      <ul className="flex flex-col gap-3">
        {players.map((player) => (
          <RankRow key={player.id} tournamentId={tournamentId} player={player} />
        ))}
      </ul>
    </main>
  );
}

function RankRow({
  tournamentId,
  player,
}: {
  tournamentId: string;
  player: PickablePlayer;
}): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UpsertFantasyRankState, FormData>(
    upsertFantasyRank,
    null,
  );

  return (
    <li className="rounded-card border-2 border-line bg-surface p-3">
      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="tournamentId" value={tournamentId} />
        <input type="hidden" name="playerId" value={player.id} />
        <p className="font-bold">
          {player.name} <span className="text-xs font-bold text-muted">{player.position}</span>
        </p>
        <SelectField
          label="Rank"
          name="rank"
          defaultValue={player.rank}
          options={FANTASY_RANKS.map((rank) => ({ value: rank, label: rank }))}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? fantasyCopy.saving : fantasyCopy.adminRanksSave}
        </Button>
        <FormFeedback
          error={state && !state.ok ? fantasyCopy.errors[state.error] : null}
          success={state?.ok ? "Saved." : null}
        />
      </form>
    </li>
  );
}
