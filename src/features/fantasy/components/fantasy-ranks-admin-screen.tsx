"use client";

import { useActionState } from "react";

import { FANTASY_PRICE_CEILING, FANTASY_PRICE_FLOOR, FANTASY_PRICE_STEP } from "@/config/fantasy";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { upsertFantasyRank, type UpsertFantasyRankState } from "../actions/upsert-fantasy-rank";
import { fantasyCopy } from "../copy";
import type { PricedPlayerAdminRow } from "../queries/list-priced-players-for-admin";

type FantasyRanksAdminScreenProps = {
  players: readonly PricedPlayerAdminRow[];
};

export function FantasyRanksAdminScreen({
  players,
}: FantasyRanksAdminScreenProps): React.JSX.Element {
  return (
    <ul className="flex flex-col gap-3">
      {players.map((player) => (
        <RankRow key={player.id} player={player} />
      ))}
    </ul>
  );
}

function RankRow({ player }: { player: PricedPlayerAdminRow }): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UpsertFantasyRankState, FormData>(
    upsertFantasyRank,
    null,
  );

  return (
    <li className="rounded-card border-2 border-line bg-surface p-3">
      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="playerId" value={player.id} />
        <p className="font-bold">
          {player.name} <span className="text-xs font-bold text-muted">{player.position}</span>
        </p>
        <TextField
          label={fantasyCopy.prices}
          name="price"
          type="number"
          inputMode="decimal"
          min={FANTASY_PRICE_FLOOR}
          max={FANTASY_PRICE_CEILING}
          step={FANTASY_PRICE_STEP}
          defaultValue={player.price}
          required
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
