"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { saveTournamentRoster, type SaveRosterState } from "../actions/save-tournament-roster";
import { describeTournamentsError, tournamentsCopy } from "../copy";
import { RosterPickList } from "./roster-pick-list";

export type RosterPickPlayer = { id: string; name: string; position: string };

type RosterPlayerPickerProps = {
  tournamentId: string;
  players: readonly RosterPickPlayer[];
  initialSelectedIds: readonly string[];
  next: "teams" | "hub";
};

export function RosterPlayerPicker({
  tournamentId,
  players,
  initialSelectedIds,
  next,
}: RosterPlayerPickerProps): React.JSX.Element {
  const [selected, setSelected] = useState(() => new Set(initialSelectedIds));
  const [query, setQuery] = useState("");
  const [state, formAction, isPending] = useActionState<SaveRosterState, FormData>(
    saveTournamentRoster,
    null,
  );
  const copy = tournamentsCopy.workspace;
  const filtered = useMemo(() => filterPlayers(players, query), [players, query]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <input type="hidden" name="next" value={next} />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="playerIds" value={id} />
      ))}
      <TextField
        label={copy.search}
        name="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.searchPlaceholder}
        autoComplete="off"
      />
      <p className="text-sm font-bold">{copy.selectedCount(selected.size)}</p>
      <RosterPickList
        players={filtered}
        selected={selected}
        onToggle={(playerId) => setSelected((prev) => toggleId(prev, playerId))}
      />
      <FormFeedback error={state?.ok === false ? describeTournamentsError(state.error) : null} />
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? copy.saving : copy.save}
      </Button>
    </form>
  );
}

function filterPlayers(players: readonly RosterPickPlayer[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return players;
  return players.filter(
    (player) =>
      player.name.toLowerCase().includes(needle) || player.position.toLowerCase().includes(needle),
  );
}

function toggleId(prev: Set<string>, playerId: string): Set<string> {
  const next = new Set(prev);
  if (next.has(playerId)) next.delete(playerId);
  else next.add(playerId);
  return next;
}
