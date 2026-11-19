"use client";

import { PageLoading } from "@/ui/page-loading";

import { fantasyCopy } from "../copy";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import type { TransferWindowMode } from "../queries/get-transfer-window";
import { FantasyGwChips } from "./fantasy-gw-chips";
import { FantasyGwTopPlayers } from "./fantasy-gw-top-players";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { FantasyStatRow } from "./fantasy-stat-row";
import { ScoutingLockedCard } from "./scouting-locked-card";
import { useFantasyGwBrowse } from "./use-fantasy-gw-browse";

type FantasyGwPanelProps = {
  days: readonly FantasyGameDayOption[];
  gameweeks: readonly FantasyGameweekView[];
  livePicks: readonly FantasyPickView[];
  liveFormation: string;
  initialGameDayId: string | null;
  initialTopPlayers: readonly GameDayTopPlayer[];
  statRow?: {
    totalPoints: number;
    bank: number;
    freeTransfers: number;
    transferWindow: TransferWindowMode;
  };
  showSquadTitle?: boolean;
  showTopPlayers?: boolean;
  /** Public other-team view: no LIVE chip; unlocked GWs show the scouting card. */
  hideLive?: boolean;
};

export function FantasyGwPanel(props: FantasyGwPanelProps): React.JSX.Element {
  const browse = useFantasyGwBrowse({
    gameweeks: props.gameweeks,
    livePicks: props.livePicks,
    liveFormation: props.liveFormation,
    initialGameDayId: props.initialGameDayId,
    initialTopPlayers: props.initialTopPlayers,
    ...(props.showTopPlayers !== undefined ? { showTopPlayers: props.showTopPlayers } : {}),
    ...(props.hideLive !== undefined ? { hideLive: props.hideLive } : {}),
  });

  return (
    <>
      <StatSlot row={props.statRow} gwPoints={browse.gwPoints} />
      <FantasyGwChips
        days={props.days}
        selectedId={browse.selectedId}
        onSelect={browse.selectDay}
        hideLive={props.hideLive ?? false}
      />
      {props.showSquadTitle ? <SquadHeading /> : null}
      {props.hideLive && !isLockedGw(props.gameweeks, browse.selectedId) ? (
        <ScoutingLockedCard />
      ) : (
        <>
          <FantasyPitchView
            formation={browse.formation}
            picks={browse.picks}
            metaByPlayerId={browse.meta}
          />
          <TopPlayersBlock
            show={browse.showTop}
            pending={browse.topPending}
            gameDayId={browse.selectedId}
            rows={browse.topPlayers}
          />
        </>
      )}
    </>
  );
}

function StatSlot(args: {
  row: FantasyGwPanelProps["statRow"];
  gwPoints: number | null;
}): React.JSX.Element | null {
  if (!args.row) return null;
  return <FantasyStatRow {...args.row} gwPoints={args.gwPoints} />;
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

function SquadHeading(): React.JSX.Element {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-display text-lg uppercase">{fantasyCopy.mySquad}</h2>
      <p className="text-xs text-muted">{fantasyCopy.deadline}</p>
    </div>
  );
}

function isLockedGw(gameweeks: readonly FantasyGameweekView[], gameDayId: string | null): boolean {
  if (!gameDayId) return false;
  return gameweeks.some((week) => week.gameDayId === gameDayId);
}
