"use client";

import { Card } from "@/ui/card";

import type { TeamDetailPlayer } from "../team-detail-player";
import { teamsCopy } from "../copy";
import { MakeCaptainButton } from "./make-captain-button";
import { UnassignRowButton } from "./unassign-row-button";

type TeamSquadListProps = {
  tournamentId: string;
  teamId: string;
  players: readonly TeamDetailPlayer[];
};

export function TeamSquadList({
  tournamentId,
  teamId,
  players,
}: TeamSquadListProps): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-2">
      {players.length === 0 ? (
        <p className="text-sm text-muted">{teamsCopy.emptySquad}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft">
          {players.map((player) => (
            <li key={player.id} className="flex items-center gap-2 py-2">
              <span className="w-10 text-xs font-bold">{player.position}</span>
              <span className="flex-1 font-bold">{player.name}</span>
              <MakeCaptainButton
                tournamentId={tournamentId}
                teamId={teamId}
                playerId={player.id}
                isCaptain={player.isCaptain}
              />
              <UnassignRowButton tournamentId={tournamentId} teamId={teamId} playerId={player.id} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
