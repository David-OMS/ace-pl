import type { Route } from "next";

import { Card } from "@/ui/card";
import { PageHeader } from "@/ui/page-header";

import { fantasyCopy } from "../copy";
import { isFantasyFormation } from "../domain/parse-formation";
import type { PublicFantasyTeam } from "../queries/get-fantasy-team-by-id";
import type { FantasyGameweekView } from "../queries/get-fantasy-team-gameweek";
import type { FantasyGameDayOption } from "../queries/list-fantasy-game-days";
import { fantasyTeamPath, FANTASY_LEADERBOARD_PATH } from "../routes";
import { buildPitchPointsMeta } from "./build-pitch-points-meta";
import { FantasyGwChips } from "./fantasy-gw-chips";
import { FantasyPitchView } from "./fantasy-pitch-view";
import { FantasyTheme } from "./fantasy-theme";

type FantasyPublicTeamScreenProps = {
  team: PublicFantasyTeam;
  gameDays: readonly FantasyGameDayOption[];
  selectedGameDayId: string | null;
  gameweek: FantasyGameweekView | null;
};

export function FantasyPublicTeamScreen({
  team,
  gameDays,
  selectedGameDayId,
  gameweek,
}: FantasyPublicTeamScreenProps): React.JSX.Element {
  const raw = gameweek?.formation ?? team.formation;
  const formation = isFantasyFormation(raw) ? raw : "2-2-2";

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
          {gameweek ? ` · ${fantasyCopy.gameweekPoints} ${gameweek.points}` : ""}
        </p>
      </Card>
      <FantasyGwChips
        days={gameDays}
        selectedId={selectedGameDayId}
        hrefFor={(dayId) =>
          (dayId ? `${fantasyTeamPath(team.id)}?gw=${dayId}` : fantasyTeamPath(team.id)) as Route
        }
      />
      <h2 className="font-display text-lg uppercase">{fantasyCopy.theirSquad}</h2>
      <FantasyPitchView
        formation={formation}
        picks={gameweek?.picks ?? team.picks}
        metaByPlayerId={buildPitchPointsMeta(gameweek)}
      />
    </FantasyTheme>
  );
}
