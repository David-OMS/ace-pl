"use client";

import { useState, useTransition } from "react";

import type { FantasyFormation } from "@/config/fantasy";

import { fetchGameDayTopPlayers } from "../actions/fetch-game-day-top-players";
import { isFantasyFormation } from "../domain/parse-formation";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import { buildPitchPointsMeta, type PitchPickMeta } from "./build-pitch-points-meta";

type BrowseInput = {
  gameweeks: readonly FantasyGameweekView[];
  livePicks: readonly FantasyPickView[];
  liveFormation: string;
  initialGameDayId: string | null;
  initialTopPlayers: readonly GameDayTopPlayer[];
  showTopPlayers?: boolean;
};

export function useFantasyGwBrowse(input: BrowseInput): FantasyGwBrowse {
  const [selectedId, setSelectedId] = useState(input.initialGameDayId);
  const [topByDay, setTopByDay] = useState<Record<string, readonly GameDayTopPlayer[]>>(() =>
    initialTop(input.initialGameDayId, input.initialTopPlayers),
  );
  const [isPending, startTransition] = useTransition();
  function selectDay(dayId: string | null): void {
    setSelectedId(dayId);
    writeGwUrl(dayId);
    if (dayId === null || topByDay[dayId]) return;
    startTransition(async () => {
      const rows = await fetchGameDayTopPlayers(dayId);
      setTopByDay((current) => ({ ...current, [dayId]: rows }));
    });
  }

  return browseView({
    input,
    selectedId,
    topByDay,
    isPending,
    selectDay,
  });
}

function browseView(args: {
  input: BrowseInput;
  selectedId: string | null;
  topByDay: Record<string, readonly GameDayTopPlayer[]>;
  isPending: boolean;
  selectDay: (dayId: string | null) => void;
}): FantasyGwBrowse {
  const gameweek = args.input.gameweeks.find((week) => week.gameDayId === args.selectedId) ?? null;
  return {
    selectedId: args.selectedId,
    formation: resolveFormation(gameweek?.formation ?? args.input.liveFormation),
    picks: gameweek?.picks ?? args.input.livePicks,
    meta: buildPitchPointsMeta(gameweek),
    gwPoints: gwPoints(gameweek),
    topPlayers: cachedTop(args.selectedId, args.topByDay),
    showTop: Boolean(args.input.showTopPlayers && args.selectedId),
    topPending: needsTopFetch(args.isPending, args.selectedId, args.topByDay),
    selectDay: args.selectDay,
  };
}

function gwPoints(gameweek: FantasyGameweekView | null): number | null {
  if (!gameweek) return null;
  return gameweek.points;
}

function cachedTop(
  selectedId: string | null,
  topByDay: Record<string, readonly GameDayTopPlayer[]>,
): readonly GameDayTopPlayer[] {
  if (!selectedId) return [];
  return topByDay[selectedId] ?? [];
}

function needsTopFetch(
  isPending: boolean,
  selectedId: string | null,
  topByDay: Record<string, readonly GameDayTopPlayer[]>,
): boolean {
  if (!isPending || selectedId === null) return false;
  return !topByDay[selectedId];
}

export type FantasyGwBrowse = {
  selectedId: string | null;
  formation: FantasyFormation;
  picks: readonly FantasyPickView[];
  meta: ReadonlyMap<string, PitchPickMeta> | undefined;
  gwPoints: number | null;
  topPlayers: readonly GameDayTopPlayer[];
  showTop: boolean;
  topPending: boolean;
  selectDay: (dayId: string | null) => void;
};

function initialTop(
  dayId: string | null,
  rows: readonly GameDayTopPlayer[],
): Record<string, readonly GameDayTopPlayer[]> {
  if (!dayId) return {};
  return { [dayId]: rows };
}

function resolveFormation(raw: string): FantasyFormation {
  return isFantasyFormation(raw) ? raw : "2-2-2";
}

function writeGwUrl(dayId: string | null): void {
  const path = window.location.pathname;
  const next = dayId ? `${path}?gw=${dayId}` : path;
  window.history.replaceState(null, "", next);
}
