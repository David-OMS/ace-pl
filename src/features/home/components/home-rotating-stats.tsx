"use client";

import { useEffect, useState } from "react";

import { STATS_ROTATE_MS } from "@/config/stats-rotate";
import { FAN_PLAYERS_STATS_PATH } from "@/features/fan";
import { Card } from "@/ui/card";
import { PlayerAvatar } from "@/ui/player-avatar";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { homeCopy } from "../copy";
import type { HomeStatBoard } from "../queries/load-home-stat-boards";

type HomeRotatingStatsProps = { boards: readonly HomeStatBoard[] };

const TITLES: Record<HomeStatBoard["metric"], string> = {
  goals: homeCopy.rotating.goals,
  assists: homeCopy.rotating.assists,
  cleanSheets: homeCopy.rotating.cleanSheets,
  yellowCards: homeCopy.rotating.yellowCards,
  redCards: homeCopy.rotating.redCards,
  saves: homeCopy.rotating.goals,
  motm: homeCopy.rotating.goals,
};

export function HomeRotatingStats({ boards }: HomeRotatingStatsProps): React.JSX.Element | null {
  const activeBoards = boards.filter((b) => b.entries.length > 0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeBoards.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % activeBoards.length);
    }, STATS_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [activeBoards.length]);

  if (activeBoards.length === 0) return null;
  const board = activeBoards[index % activeBoards.length];
  if (!board) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{TITLES[board.metric]}</h2>
        <SoftNavLink href={FAN_PLAYERS_STATS_PATH} className="text-xs font-bold text-muted">
          {homeCopy.statsLink}
        </SoftNavLink>
      </div>
      <Card className="p-0">
        <ul>
          {board.entries.map((entry, rank) => (
            <li
              key={`${board.metric}-${entry.playerId}`}
              className="flex items-center gap-3 border-b border-line-soft px-3 py-2.5 last:border-b-0"
            >
              <span className="w-5 text-sm font-bold text-muted">{rank + 1}</span>
              <PlayerAvatar name={entry.name} photoUrl={entry.photoUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{entry.name}</p>
                <p className="text-xs text-muted">{homeCopy.position(entry.position)}</p>
              </div>
              <span className="font-display text-lg">{entry.value}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
