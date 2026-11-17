import type { PlayerPosition } from "@/config/player-positions";

type BuildSquadRowsInput = {
  tournamentId: string;
  fixtureId: string;
  members: readonly { player_id: string; team_id: string }[];
  players: readonly { id: string; position: PlayerPosition }[];
};

/** Everyone starts as played; tap marks them absent (mockup). */
export function buildSquadRows({ tournamentId, fixtureId, members, players }: BuildSquadRowsInput) {
  const positionById = new Map(players.map((p) => [p.id, p.position]));
  return members.map((m) => {
    const position = positionById.get(m.player_id) ?? null;
    return {
      tournament_id: tournamentId,
      fixture_id: fixtureId,
      player_id: m.player_id,
      team_id: m.team_id,
      status: "played" as const,
      position,
      is_goalkeeper: position === "GK",
    };
  });
}
