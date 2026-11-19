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
import type { TransferWindowMode } from "../queries/get-transfer-window";
import { FANTASY_TRANSFERS_PATH } from "../routes";
import { FantasyGwPanel } from "./fantasy-gw-panel";
import { FantasyLeaderboardMini } from "./fantasy-leaderboard-mini";
import { FantasyScoringTable } from "./fantasy-scoring-table";
import { FantasyTheme } from "./fantasy-theme";
import { FantasyTransferLog } from "./fantasy-transfer-log";

type FantasyTeamScreenProps = {
  team: MyFantasyTeam;
  leaderboard: readonly FantasyLeaderboardRow[];
  userId: string;
  myRank: number;
  transferWindow: TransferWindowMode;
  gameDays: readonly FantasyGameDayOption[];
  gameweeks: readonly FantasyGameweekView[];
  selectedGameDayId: string | null;
  topPlayers: readonly GameDayTopPlayer[];
  transfers: readonly FantasyTransferLogRow[];
};

export function FantasyTeamScreen(props: FantasyTeamScreenProps): React.JSX.Element {
  const liveFormation = isFantasyFormation(props.team.formation) ? props.team.formation : "2-2-2";
  const locked = props.transferWindow === "locked";

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <TeamHeader
        name={props.team.name}
        formation={liveFormation}
        bank={props.team.bank}
        myRank={props.myRank}
        total={props.leaderboard.length || 1}
      />
      <FantasyGwPanel
        days={props.gameDays}
        gameweeks={props.gameweeks}
        livePicks={props.team.picks}
        liveFormation={props.team.formation}
        initialGameDayId={props.selectedGameDayId}
        initialTopPlayers={props.topPlayers}
        showSquadTitle
        showTopPlayers
        statRow={{
          totalPoints: props.team.totalPoints,
          bank: props.team.bank,
          freeTransfers: props.team.freeTransfers,
          transferWindow: props.transferWindow,
        }}
      />
      {locked ? (
        <p className="rounded-card border-2 border-line bg-surface px-3 py-3 text-sm">
          <span className="font-bold">{fantasyCopy.transfersLockedTitle}. </span>
          {fantasyCopy.transfersLockedBody}
        </p>
      ) : (
        <ButtonLink href={FANTASY_TRANSFERS_PATH} fullWidth>
          {fantasyCopy.makeTransfers}
        </ButtonLink>
      )}
      <FantasyLeaderboardMini rows={props.leaderboard} highlightUserId={props.userId} />
      <FantasyTransferLog rows={props.transfers} />
      <FantasyScoringTable />
    </FantasyTheme>
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
