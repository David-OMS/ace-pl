import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { fantasyCopy } from "../copy";
import { canViewOtherSquad } from "../domain/can-view-other-squad";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { FantasyTeamPublicHeader } from "../queries/get-fantasy-team-public";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
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
};

export function FantasyPublicTeamScreen({
  team,
  gameDays,
  gameweeks,
  selectedGameDayId,
  topPlayers,
}: FantasyPublicTeamScreenProps): React.JSX.Element {
  const unlocked = canViewOtherSquad(gameweeks.length);
  const lockedDays = gameDays.filter((day) => gameweeks.some((week) => week.gameDayId === day.id));
  const initialGw =
    selectedGameDayId && gameweeks.some((week) => week.gameDayId === selectedGameDayId)
      ? selectedGameDayId
      : (lockedDays[lockedDays.length - 1]?.id ?? null);

  return (
    <FantasyTheme className="flex flex-col gap-4 px-4 py-4 pb-8">
      <PageHeader
        title={team.name}
        back={{ href: FANTASY_LEADERBOARD_PATH, label: fantasyCopy.leaderboard }}
      />
      <Card>
        <p className="text-sm text-muted">{team.ownerName}</p>
        <p className="text-xs text-muted">
          {fantasyCopy.totalPoints} {team.totalPoints}
        </p>
      </Card>
      {unlocked ? (
        <>
          <h2 className="font-display text-lg uppercase">{fantasyCopy.theirSquad}</h2>
          <FantasyGwPanel
            days={lockedDays}
            gameweeks={gameweeks}
            livePicks={[]}
            liveFormation={team.formation}
            initialGameDayId={initialGw}
            initialTopPlayers={topPlayers}
            hideLive
            showTopPlayers
          />
        </>
      ) : (
        <Card>
          <p className="text-sm text-muted">{fantasyCopy.squadHiddenUntilMatchday}</p>
        </Card>
      )}
    </FantasyTheme>
  );
}
