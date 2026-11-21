import { SoftNavLink } from "@/ui/soft-nav-link";

import { fantasyCopy } from "../copy";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { FantasyTeamPublicHeader } from "../queries/get-fantasy-team-public";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import type { GameDayPointsSummary } from "../queries/list-game-day-point-summaries";
import type { GameDayTopPlayer } from "../queries/list-game-day-top-players";
import { FANTASY_LEADERBOARD_PATH } from "../routes";
import { FantasyGwPanel } from "./fantasy-gw-panel";
import { FantasyTheme } from "./fantasy-theme";

type FantasyPublicTeamScreenProps = {
  team: FantasyTeamPublicHeader;
  gameDays: readonly FantasyGameDayOption[];
  gameweeks: readonly FantasyGameweekView[];
  selectedGameDayId: string | null;
  topPlayers: readonly GameDayTopPlayer[];
  summaries: readonly GameDayPointsSummary[];
  nowMs: number;
};

export function FantasyPublicTeamScreen({
  team,
  gameDays,
  gameweeks,
  selectedGameDayId,
  topPlayers,
  summaries,
  nowMs,
}: FantasyPublicTeamScreenProps): React.JSX.Element {
  const lockedIds = new Set(gameweeks.map((week) => week.gameDayId));
  const latestLocked = [...gameDays].reverse().find((day) => lockedIds.has(day.id));
  const initialGw =
    selectedGameDayId && lockedIds.has(selectedGameDayId)
      ? selectedGameDayId
      : (latestLocked?.id ?? gameDays[0]?.id ?? null);

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <SoftNavLink href={FANTASY_LEADERBOARD_PATH} className="text-xs font-bold text-muted">
        {fantasyCopy.backToFantasy}
      </SoftNavLink>
      <header className="flex flex-col gap-1">
        <p className="text-sm font-bold text-muted">{team.ownerName}</p>
        <h1 className="truncate font-display text-2xl uppercase">{team.name}</h1>
        <p className="text-xs font-bold text-muted">
          {fantasyCopy.totalPoints} {team.totalPoints}
        </p>
      </header>
      <FantasyGwPanel
        days={gameDays}
        gameweeks={gameweeks}
        livePicks={[]}
        liveFormation={team.formation}
        initialGameDayId={initialGw}
        initialTopPlayers={topPlayers}
        summaries={summaries}
        hideLive
        showTopPlayers
        nowMs={nowMs}
      />
    </FantasyTheme>
  );
}
