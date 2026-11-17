import "server-only";

import { getTeamSetup } from "@/features/teams/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { TournamentDetail } from "./get-tournament";

export type TournamentHubData = {
  teams: { id: string; name: string; color: string; playerCount: number }[];
  unassigned: { id: string; name: string; position: string }[];
  hasFixtures: boolean;
  keeperCandidates: { id: string; name: string }[];
};

export async function loadTournamentHub(tournament: TournamentDetail): Promise<TournamentHubData> {
  const sharedKeeperIds = tournament.sharedKeepers.map((keeper) => keeper.playerId);
  const supabase = await createSupabaseServerClient();
  const [setup, fixtureCount] = await Promise.all([
    getTeamSetup({
      tournamentId: tournament.id,
      squadSize: tournament.squadSize,
      keeperMode: tournament.keeperMode,
      sharedKeeperIds,
      rosterPlayerIds: tournament.rosterPlayerIds,
    }),
    supabase
      .from("fixtures")
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournament.id),
  ]);
  if (fixtureCount.error) throw fixtureCount.error;

  const rosterIds = new Set(tournament.rosterPlayerIds);
  const sharedKeeperSet = new Set(sharedKeeperIds);
  const keeperCandidates = setup.unassigned
    .concat(setup.squads.flatMap((squad) => squad.players))
    .filter((player) => player.position === "GK" && rosterIds.has(player.id))
    .filter((player) => !sharedKeeperSet.has(player.id))
    .map((player) => ({ id: player.id, name: player.name }));

  return {
    teams: setup.squads.map((squad) => ({
      id: squad.teamId,
      name: squad.teamName,
      color: squad.color,
      playerCount: squad.players.length,
    })),
    unassigned: setup.unassigned.map((player) => ({
      id: player.id,
      name: player.name,
      position: player.position,
    })),
    hasFixtures: (fixtureCount.count ?? 0) > 0,
    keeperCandidates,
  };
}
