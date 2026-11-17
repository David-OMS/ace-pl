"use client";

import { useState } from "react";

import type { LeaderboardMetric } from "@/features/leaderboards";
import { PlayerAvatar } from "@/ui/player-avatar";
import { Card } from "@/ui/card";

import { fanPlayersCopy } from "../copy";
import type { FanLeaderboardRow } from "../queries/build-fan-player-stats";

const METRICS: readonly LeaderboardMetric[] = [
  "goals",
  "assists",
  "cleanSheets",
  "saves",
  "motm",
  "yellowCards",
  "redCards",
];

const METRIC_LABEL: Record<LeaderboardMetric, string> = {
  goals: fanPlayersCopy.leaderboard.goals,
  assists: fanPlayersCopy.leaderboard.assists,
  cleanSheets: fanPlayersCopy.leaderboard.cleanSheets,
  saves: fanPlayersCopy.leaderboard.saves,
  motm: fanPlayersCopy.leaderboard.motm,
  yellowCards: fanPlayersCopy.leaderboard.yellowCards,
  redCards: fanPlayersCopy.leaderboard.redCards,
};

type PlayerLeaderboardPanelProps = {
  boards: Record<LeaderboardMetric, FanLeaderboardRow[]>;
};

export function PlayerLeaderboardPanel({ boards }: PlayerLeaderboardPanelProps): React.JSX.Element {
  const [metric, setMetric] = useState<LeaderboardMetric>("goals");
  const rows = boards[metric] ?? [];

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 font-display text-lg uppercase">{METRIC_LABEL[metric]}</h2>
      <div className="flex gap-2 overflow-x-auto px-1 pb-1">
        {METRICS.map((key) => (
          <MetricChip
            key={key}
            label={METRIC_LABEL[key]}
            active={metric === key}
            onClick={() => setMetric(key)}
          />
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="px-1 text-sm text-muted">{fanPlayersCopy.leaderboard.empty}</p>
      ) : (
        <Card className="p-0">
          <ul>
            {rows.map((row, index) => (
              <li
                key={`${metric}-${row.playerId}`}
                className="flex items-center gap-3 border-b border-line-soft px-3 py-2.5 last:border-b-0"
              >
                <span className="w-5 text-sm font-bold text-muted">{index + 1}</span>
                <PlayerAvatar name={row.name} photoUrl={row.photoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{row.name}</p>
                  <p className="text-xs text-muted">{fanPlayersCopy.position(row.position)}</p>
                </div>
                <span className="font-display text-lg">{row.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function MetricChip({
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
      className={`shrink-0 border-2 px-2.5 py-1 text-[10px] font-extrabold tracking-wide uppercase ${
        active ? "border-line bg-accent text-on-accent" : "border-line-soft bg-surface text-muted"
      }`}
    >
      {label}
    </button>
  );
}
