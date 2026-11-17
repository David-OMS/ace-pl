import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { sortPlayers, type PlayerSummary } from "@/features/players";

export type TeamRef = { id: string; name: string; color?: string };
export type CurrentMembership = { teamId: string; playerId: string; isCaptain: boolean };
export type SquadPlayer = PlayerSummary & { isCaptain: boolean };

export type Squad = {
  teamId: string;
  teamName: string;
  color: string;
  players: SquadPlayer[];
  /** Positive when there are spots left, negative when the squad is over the tournament size. */
  openSpots: number;
};

export type TeamSetup = { squads: Squad[]; unassigned: PlayerSummary[] };

type BuildSquadsInput = {
  teams: readonly TeamRef[];
  memberships: readonly CurrentMembership[];
  players: readonly PlayerSummary[];
  squadSize: number;
  /** Shared keepers (and similar) stay out of the team unassigned pool. */
  excludeFromUnassigned?: readonly string[];
};

/** Groups the given players into squads; everyone else in the list is unassigned. */
export function buildSquads({
  teams,
  memberships,
  players,
  squadSize,
  excludeFromUnassigned = [],
}: BuildSquadsInput): TeamSetup {
  const playersById = new Map(players.map((player) => [player.id, player]));
  const knownTeams = new Set(teams.map((team) => team.id));
  const excluded = new Set(excludeFromUnassigned);
  // Only memberships tied to a team we still have count as assigned.
  const assignedIds = new Set(
    memberships.filter((m) => knownTeams.has(m.teamId)).map((m) => m.playerId),
  );

  const squads = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    .map((team) => {
      const squadPlayers = memberships
        .filter((m) => m.teamId === team.id)
        .flatMap((m) => {
          const player = playersById.get(m.playerId);
          return player ? [{ ...player, isCaptain: m.isCaptain }] : [];
        });
      return {
        teamId: team.id,
        teamName: team.name,
        color: team.color ?? DEFAULT_TEAM_COLOR,
        players: sortPlayers(squadPlayers),
        openSpots: squadSize - squadPlayers.length,
      };
    });

  const unassigned = sortPlayers(
    players.filter((player) => !assignedIds.has(player.id) && !excluded.has(player.id)),
  );
  return { squads, unassigned };
}
