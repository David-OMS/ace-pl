import type { Route } from "next";

import type { FantasyFormation } from "@/config/fantasy";
import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { fantasyCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";
import { isFantasyFormation } from "../domain/parse-formation";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import type { FantasyTransferLogRow } from "../queries/list-my-fantasy-transfers";
import { FANTASY_PATH, FANTASY_TRANSFERS_PATH } from "../routes";
import { buildPitchPointsMeta } from "./build-pitch-points-meta";
import { FantasyGwChips } from "./fantasy-gw-chips";
import { FantasyGwTopPlayers } from "./fantasy-gw-top-players";
import { FantasyLeaderboardMini } from "./fantasy-leaderboard-mini";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { FantasyScoringTable } from "./fantasy-scoring-table";
import { FantasyTheme } from "./fantasy-theme";
import { FantasyTransferLog } from "./fantasy-transfer-log";

type FantasyTeamScreenProps = {
  team: MyFantasyTeam;
  leaderboard: readonly FantasyLeaderboardRow[];
  userId: string;
  myRank: number;
  beforeFirstDeadline: boolean;
  gameDays: readonly FantasyGameDayOption[];
  selectedGameDayId: string | null;
  gameweek: FantasyGameweekView | null;
  topPlayers: readonly GameDayTopPlayer[];
  transfers: readonly FantasyTransferLogRow[];
};

export function FantasyTeamScreen(props: FantasyTeamScreenProps): React.JSX.Element {
  const formation = resolveFormation(props.gameweek?.formation ?? props.team.formation);

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <TeamHeader
        name={props.team.name}
        formation={formation}
        bank={props.team.bank}
        myRank={props.myRank}
        total={props.leaderboard.length || 1}
      />
      <TeamStatRow
        totalPoints={props.team.totalPoints}
        bank={props.team.bank}
        freeTransfers={props.team.freeTransfers}
        beforeFirstDeadline={props.beforeFirstDeadline}
        gwPoints={props.gameweek ? props.gameweek.points : null}
      />
      <FantasyGwChips
        days={props.gameDays}
        selectedId={props.selectedGameDayId}
        hrefFor={(dayId) => (dayId ? `${FANTASY_PATH}?gw=${dayId}` : FANTASY_PATH) as Route}
      />
      <SquadBlock
        formation={formation}
        picks={props.gameweek?.picks ?? props.team.picks}
        gameweek={props.gameweek}
      />
      <ButtonLink href={FANTASY_TRANSFERS_PATH} fullWidth>
        {fantasyCopy.makeTransfers}
      </ButtonLink>
      {props.selectedGameDayId ? (
        <FantasyGwTopPlayers gameDayId={props.selectedGameDayId} rows={props.topPlayers} />
      ) : null}
      <FantasyLeaderboardMini rows={props.leaderboard} highlightUserId={props.userId} />
      <FantasyTransferLog rows={props.transfers} />
      <FantasyScoringTable />
    </FantasyTheme>
  );
}

function resolveFormation(raw: string): FantasyFormation {
  return isFantasyFormation(raw) ? raw : "2-2-2";
}

function SquadBlock(args: {
  formation: FantasyFormation;
  picks: MyFantasyTeam["picks"];
  gameweek: FantasyGameweekView | null;
}): React.JSX.Element {
  return (
    <>
      <div className="flex items-end justify-between">
        <h2 className="font-display text-lg uppercase">{fantasyCopy.mySquad}</h2>
        <p className="text-xs text-muted">{fantasyCopy.deadline}</p>
      </div>
      <FantasyPitchView
        formation={args.formation}
        picks={args.picks}
        metaByPlayerId={buildPitchPointsMeta(args.gameweek)}
      />
    </>
  );
}

function TeamHeader(args: {
  name: string;
  formation: string;
  bank: number;
  myRank: number;
  total: number;
}): React.JSX.Element {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate font-display text-xl uppercase">{args.name}</h1>
        <p className="text-xs text-muted">
          Formation {args.formation} · Bank {formatFantasyPrice(args.bank)}
        </p>
      </div>
      <span className="shrink-0 rounded-card border-2 border-line bg-surface-alt px-2 py-1 text-xs font-bold">
        {fantasyCopy.rankOf(args.myRank, args.total)}
      </span>
    </Card>
  );
}

function TeamStatRow(args: {
  totalPoints: number;
  bank: number;
  freeTransfers: number;
  beforeFirstDeadline: boolean;
  gwPoints: number | null;
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatBox label={fantasyCopy.totalPoints} value={String(args.totalPoints)} />
      <StatBox
        label={args.gwPoints !== null ? fantasyCopy.gameweekPoints : fantasyCopy.bankLabel}
        value={args.gwPoints !== null ? String(args.gwPoints) : formatFantasyPrice(args.bank)}
      />
      {args.beforeFirstDeadline ? (
        <StatBox label={fantasyCopy.squadEditsLabel} value={fantasyCopy.squadEditsOpen} />
      ) : (
        <StatBox label={fantasyCopy.freeTransfers} value={String(args.freeTransfers)} />
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-card border-2 border-line bg-surface px-2 py-3 text-center">
      <p className="font-display text-2xl">{value}</p>
      <p className="text-[10px] font-bold tracking-wide text-muted uppercase">{label}</p>
    </div>
  );
}
