"use client";

import { useMemo, useState } from "react";

import { fanPlayerPath } from "@/features/fan";
import type { LeaderboardMetric } from "@/features/leaderboards";
import { PlayerAvatar } from "@/ui/player-avatar";
import { SoftNavLink } from "@/ui/soft-nav-link";
import { TeamNameBadge } from "@/ui/team-name-badge";
import { TextField } from "@/ui/text-field";

import { fanPlayersCopy } from "../copy";
import { filterFanPlayers, type FanPlayerListItem } from "../domain/filter-fan-players";
import type { FanLeaderboardRow } from "../queries/build-fan-player-stats";
import { MyRosterCard, type MyRosterPlayer } from "./my-roster-card";
import { PlayerLeaderboardPanel } from "./player-leaderboard-panel";

type View = "roster" | "stats";

type FanPlayersListScreenProps = {
  players: readonly FanPlayerListItem[];
  boards: Record<LeaderboardMetric, FanLeaderboardRow[]>;
  initialView?: View;
  me?: MyRosterPlayer | null;
};

export function FanPlayersListScreen({
  players,
  boards,
  initialView = "roster",
  me = null,
}: FanPlayersListScreenProps): React.JSX.Element {
  const [view, setView] = useState<View>(initialView);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterFanPlayers(players, query), [players, query]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <h1 className="font-display text-2xl uppercase">{fanPlayersCopy.title}</h1>
      <div className="flex gap-2">
        <ViewChip
          label={fanPlayersCopy.viewRoster}
          active={view === "roster"}
          onClick={() => setView("roster")}
        />
        <ViewChip
          label={fanPlayersCopy.viewStats}
          active={view === "stats"}
          onClick={() => setView("stats")}
        />
      </div>
      {view === "stats" ? (
        <>
          <p className="text-sm text-muted">{fanPlayersCopy.statsScope}</p>
          <PlayerLeaderboardPanel boards={boards} />
        </>
      ) : (
        <>
          {me ? <MyRosterCard player={me} /> : null}
          <RosterList
            players={players}
            filtered={filtered}
            query={query}
            onQuery={setQuery}
            excludeId={me?.id ?? null}
            heading={me ? fanPlayersCopy.otherPlayers : null}
          />
        </>
      )}
    </div>
  );
}

function RosterList(args: {
  players: readonly FanPlayerListItem[];
  filtered: readonly FanPlayerListItem[];
  query: string;
  onQuery: (value: string) => void;
  excludeId: string | null;
  heading: string | null;
}): React.JSX.Element {
  const pool = args.players.filter((player) => player.id !== args.excludeId);
  const visible = args.filtered.filter((player) => player.id !== args.excludeId);

  return (
    <>
      {args.heading ? <h2 className="font-display text-lg uppercase">{args.heading}</h2> : null}
      <TextField
        label={fanPlayersCopy.searchLabel}
        name="player-search"
        value={args.query}
        onChange={(event) => args.onQuery(event.target.value)}
        placeholder={fanPlayersCopy.searchPlaceholder}
      />
      {pool.length === 0 ? (
        <p className="text-sm text-muted">{fanPlayersCopy.emptyRoster}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted">{fanPlayersCopy.emptySearch}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {visible.map((player) => (
            <li key={player.id}>
              <SoftNavLink
                href={fanPlayerPath(player.id)}
                className="flex items-center gap-3 border-2 border-line-soft bg-surface px-3 py-2.5"
              >
                <PlayerAvatar name={player.name} photoUrl={player.photoUrl} size="md" />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{player.name}</p>
                    <p className="text-xs text-muted">{fanPlayersCopy.position(player.position)}</p>
                  </div>
                  {player.teamName && player.teamColor ? (
                    <TeamNameBadge name={player.teamName} color={player.teamColor} />
                  ) : null}
                </div>
              </SoftNavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ViewChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 px-3 py-1.5 text-[10px] font-extrabold tracking-wide uppercase ${
        active ? "border-line bg-accent text-on-accent" : "border-line-soft bg-surface text-muted"
      }`}
    >
      {label}
    </button>
  );
}
