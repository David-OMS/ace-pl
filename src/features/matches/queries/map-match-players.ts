import type { ParticipationStatus } from "@/config/match-events";
import type { PlayerPosition } from "@/config/player-positions";
import { sortPlayers } from "@/features/players";

import type { MatchPlayer } from "./match-entry-types";

type MapMatchPlayersInput = {
  participations: readonly {
    id: string;
    player_id: string;
    team_id: string;
    status: ParticipationStatus;
    is_goalkeeper: boolean;
  }[];
  players: readonly {
    id: string;
    name: string;
    position: PlayerPosition;
    is_active: boolean;
  }[];
  registered: ReadonlyMap<string, string>;
  homeTeamId: string;
  awayTeamId: string;
};

export function mapMatchPlayers({
  participations,
  players,
  registered,
  homeTeamId,
  awayTeamId,
}: MapMatchPlayersInput): { homePlayers: MatchPlayer[]; awayPlayers: MatchPlayer[] } {
  const playerById = new Map(players.map((p) => [p.id, p]));
  const mapped: MatchPlayer[] = participations.flatMap((row) => {
    const player = playerById.get(row.player_id);
    if (!player) return [];
    const registeredTeamId = registered.get(row.player_id);
    return [
      {
        participationId: row.id,
        playerId: row.player_id,
        name: player.name,
        position: player.position,
        teamId: row.team_id,
        status: row.status,
        isGoalkeeper: row.is_goalkeeper,
        isBorrowed: registeredTeamId !== undefined && registeredTeamId !== row.team_id,
      },
    ];
  });

  return {
    homePlayers: sortPlayers(mapped.filter((p) => p.teamId === homeTeamId)),
    awayPlayers: sortPlayers(mapped.filter((p) => p.teamId === awayTeamId)),
  };
}
