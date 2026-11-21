import { ButtonLink } from "@/ui/button-link";

import { fantasyCopy } from "../copy";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { GameDayPointsSummary } from "../queries/list-game-day-point-summaries";
import type { FantasyLeaderboardRow } from "../queries/list-fantasy-leaderboard";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import type { FantasyTransferLogRow } from "../queries/list-my-fantasy-transfers";
import type { TransferWindowMode } from "../queries/get-transfer-window";
import { FANTASY_LEADERBOARD_PATH } from "../routes";
import { ClubLimitBanner } from "./club-limit-banner";
import { FantasyGwPanel } from "./fantasy-gw-panel";
import { FantasyLeaderboardMini } from "./fantasy-leaderboard-mini";
import { FantasyScoringTable } from "./fantasy-scoring-table";
import { FantasyTheme } from "./fantasy-theme";
import { FantasyTransferLog } from "./fantasy-transfer-log";

type FantasyTeamScreenProps = {
  team: MyFantasyTeam;
  ownerName: string;
  leaderboard: readonly FantasyLeaderboardRow[];
  userId: string;
  myRank: number;
  transferWindow: TransferWindowMode;
  gameDays: readonly FantasyGameDayOption[];
  gameweeks: readonly FantasyGameweekView[];
  selectedGameDayId: string | null;
  topPlayers: readonly GameDayTopPlayer[];
  summaries: readonly GameDayPointsSummary[];
  transfers: readonly FantasyTransferLogRow[];
  nowMs: number;
};

export function FantasyTeamScreen(props: FantasyTeamScreenProps): React.JSX.Element {
  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-bold text-muted">{props.ownerName}</p>
        <h1 className="truncate font-display text-2xl uppercase">{props.team.name}</h1>
        <p className="text-xs font-bold text-muted">
          {fantasyCopy.rankOf(props.myRank, props.leaderboard.length || 1)}
        </p>
      </header>
      <ClubLimitBanner picks={props.team.picks} />
      <FantasyGwPanel
        days={props.gameDays}
        gameweeks={props.gameweeks}
        livePicks={props.team.picks}
        liveFormation={props.team.formation}
        initialGameDayId={props.selectedGameDayId}
        initialTopPlayers={props.topPlayers}
        summaries={props.summaries}
        transferWindow={props.transferWindow}
        showEditActions
        showDeadline
        showTopPlayers
        nowMs={props.nowMs}
      />
      <ButtonLink href={FANTASY_LEADERBOARD_PATH} variant="secondary" fullWidth>
        {fantasyCopy.leaderboard}
      </ButtonLink>
      <FantasyLeaderboardMini rows={props.leaderboard} highlightUserId={props.userId} />
      <FantasyTransferLog rows={props.transfers} />
      <FantasyScoringTable />
    </FantasyTheme>
  );
}
