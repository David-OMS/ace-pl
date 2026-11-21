"use client";

import { PageLoading } from "@/ui/page-loading";

import { fantasyCopy } from "../copy";
import {
  currentFantasyGameDayId,
  reachableFantasyGameDays,
} from "../domain/reachable-fantasy-game-days";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { GameDayPointsSummary } from "../queries/list-game-day-point-summaries";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import type { TransferWindowMode } from "../queries/get-transfer-window";
import { FantasyGwHeader } from "./fantasy-gw-header";
import type { FantasyGwNavOption } from "./fantasy-gw-nav";
import { FantasyGwTopPlayers } from "./fantasy-gw-top-players";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { ScoutingLockedCard } from "./scouting-locked-card";
import { useFantasyGwBrowse } from "./use-fantasy-gw-browse";

type FantasyGwPanelProps = {
  days: readonly FantasyGameDayOption[];
  gameweeks: readonly FantasyGameweekView[];
  livePicks: readonly FantasyPickView[];
  liveFormation: string;
  initialGameDayId: string | null;
  initialTopPlayers: readonly GameDayTopPlayer[];
  summaries?: readonly GameDayPointsSummary[];
  transferWindow?: TransferWindowMode;
  showEditActions?: boolean;
  showDeadline?: boolean;
  showTopPlayers?: boolean;
  hideLive?: boolean;
  /** Server clock — used to hide future gameweeks. */
  nowMs: number;
};

export function FantasyGwPanel(props: FantasyGwPanelProps): React.JSX.Element {
  const hideLive = props.hideLive ?? false;
  const reachable = reachableFantasyGameDays(props.days, props.nowMs);
  const currentGwId = currentFantasyGameDayId(props.days, props.nowMs);
  const browse = useFantasyGwBrowse({
    gameweeks: props.gameweeks,
    livePicks: props.livePicks,
    liveFormation: props.liveFormation,
    initialGameDayId: clampInitialGw(props.initialGameDayId, reachable, hideLive),
    initialTopPlayers: props.initialTopPlayers,
    ...(props.showTopPlayers !== undefined ? { showTopPlayers: props.showTopPlayers } : {}),
    ...(props.hideLive !== undefined ? { hideLive: props.hideLive } : {}),
  });
  const canEdit =
    Boolean(props.showEditActions) &&
    (browse.selectedId === null || browse.selectedId === currentGwId);

  return (
    <>
      <FantasyGwHeader
        days={props.days}
        options={navOptions(reachable, hideLive)}
        selectedId={browse.selectedId}
        onSelect={browse.selectDay}
        gwPoints={browse.gwPoints}
        summaries={props.summaries}
        showEditActions={canEdit}
        showDeadline={Boolean(props.showDeadline)}
        transferWindow={props.transferWindow ?? "open"}
      />
      <GwBody
        hideLive={hideLive}
        locked={isLockedGw(props.gameweeks, browse.selectedId)}
        formation={browse.formation}
        picks={browse.picks}
        meta={browse.meta}
        showTop={browse.showTop}
        topPending={browse.topPending}
        selectedId={browse.selectedId}
        topPlayers={browse.topPlayers}
      />
    </>
  );
}

function GwBody(args: {
  hideLive: boolean;
  locked: boolean;
  formation: Parameters<typeof FantasyPitchView>[0]["formation"];
  picks: readonly FantasyPickView[];
  meta: Parameters<typeof FantasyPitchView>[0]["metaByPlayerId"];
  showTop: boolean;
  topPending: boolean;
  selectedId: string | null;
  topPlayers: readonly GameDayTopPlayer[];
}): React.JSX.Element {
  if (args.hideLive && !args.locked) return <ScoutingLockedCard />;
  return (
    <>
      <FantasyPitchView formation={args.formation} picks={args.picks} metaByPlayerId={args.meta} />
      <TopPlayersBlock
        show={args.showTop}
        pending={args.topPending}
        gameDayId={args.selectedId}
        rows={args.topPlayers}
      />
    </>
  );
}

function TopPlayersBlock(args: {
  show: boolean;
  pending: boolean;
  gameDayId: string | null;
  rows: readonly GameDayTopPlayer[];
}): React.JSX.Element | null {
  if (!args.show || !args.gameDayId) return null;
  if (args.pending) return <PageLoading blocks={2} />;
  return <FantasyGwTopPlayers gameDayId={args.gameDayId} rows={args.rows} />;
}

function navOptions(
  days: readonly FantasyGameDayOption[],
  hideLive: boolean,
): FantasyGwNavOption[] {
  const weeks = days.map((day) => ({
    id: day.id,
    label: `Gameweek ${day.label.replace("GW", "")}`,
  }));
  if (hideLive) return weeks;
  return [{ id: null, label: fantasyCopy.gameweekLive }, ...weeks];
}

function clampInitialGw(
  initial: string | null,
  reachable: readonly FantasyGameDayOption[],
  hideLive: boolean,
): string | null {
  if (initial === null) return hideLive ? (reachable[reachable.length - 1]?.id ?? null) : null;
  if (reachable.some((day) => day.id === initial)) return initial;
  return hideLive ? (reachable[reachable.length - 1]?.id ?? null) : null;
}

function isLockedGw(gameweeks: readonly FantasyGameweekView[], gameDayId: string | null): boolean {
  if (!gameDayId) return false;
  return gameweeks.some((week) => week.gameDayId === gameDayId);
}
