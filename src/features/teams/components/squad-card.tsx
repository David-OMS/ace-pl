import { Card } from "@/ui/card";

import { teamsCopy } from "../copy";
import type { Squad, TeamRef } from "../domain/build-squads";
import { AssignPlayerSelect } from "./assign-player-select";
import { MakeCaptainButton } from "./make-captain-button";
import { RemoveTeamButton } from "./remove-team-button";

type SquadCardProps = {
  tournamentId: string;
  squad: Squad;
  teams: readonly TeamRef[];
};

function openSpotsLabel(openSpots: number): string {
  if (openSpots > 0) return teamsCopy.openSpots(openSpots);
  if (openSpots < 0) return teamsCopy.overfilled(openSpots);
  return teamsCopy.full;
}

export function SquadCard({ tournamentId, squad, teams }: SquadCardProps): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h3 className="font-display text-lg uppercase">{squad.teamName}</h3>
          <span className="text-xs font-bold text-muted uppercase">
            {openSpotsLabel(squad.openSpots)}
          </span>
        </div>
        <RemoveTeamButton
          tournamentId={tournamentId}
          teamId={squad.teamId}
          teamName={squad.teamName}
        />
      </div>
      {squad.players.length === 0 ? (
        <p className="text-sm text-muted">{teamsCopy.emptySquad}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft">
          {squad.players.map((player) => (
            <li key={player.id} className="flex items-center gap-2 py-2">
              <span className="w-10 text-xs font-bold">{player.position}</span>
              <span className="flex-1 font-bold">{player.name}</span>
              <MakeCaptainButton
                tournamentId={tournamentId}
                teamId={squad.teamId}
                playerId={player.id}
                isCaptain={player.isCaptain}
              />
              <AssignPlayerSelect
                tournamentId={tournamentId}
                playerId={player.id}
                currentTeamId={squad.teamId}
                teams={teams}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
