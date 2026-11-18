import type { PlayerPosition } from "@/config/player-positions";
import type { MatchPlayer } from "@/features/matches";
import { sortPlayers } from "@/features/players";

type SquadMember = {
  playerId: string;
  teamId: string;
  name: string;
  position: PlayerPosition;
  isCaptain: boolean;
};

/** Registered team lists shaped like match players for the fan preview. */
export function mapSquadPreviewPlayers(
  members: readonly SquadMember[],
  teamId: string,
): MatchPlayer[] {
  const mapped: MatchPlayer[] = members
    .filter((row) => row.teamId === teamId)
    .map((row) => ({
      participationId: `squad:${row.playerId}`,
      playerId: row.playerId,
      name: row.name,
      position: row.position,
      teamId: row.teamId,
      status: "played",
      isGoalkeeper: row.position === "GK",
      isBorrowed: false,
      isCaptain: row.isCaptain,
    }));
  return sortPlayers(mapped);
}
