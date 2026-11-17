import "server-only";

import type { KeeperMode } from "@/config/tournament-rules";
import { listPlayers } from "@/features/players";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildSquads, type TeamSetup } from "../domain/build-squads";

type GetTeamSetupArgs = {
  tournamentId: string;
  squadSize: number;
  keeperMode: KeeperMode;
  sharedKeeperIds: readonly string[];
  rosterPlayerIds: readonly string[];
};

/**
 * Hub unassigned = roster players with no current team.
 * Only picked shared keepers are kept out of that list (they show under Shared keepers).
 * GKs are still listed until they’re picked — they just can’t be added to teams in shared mode.
 */
export async function getTeamSetup(args: GetTeamSetupArgs): Promise<TeamSetup> {
  const { tournamentId, squadSize, sharedKeeperIds, rosterPlayerIds } = args;
  const supabase = await createSupabaseServerClient();
  const [teams, memberships, players] = await Promise.all([
    supabase.from("teams").select("id, name, color").eq("tournament_id", tournamentId),
    supabase
      .from("team_memberships")
      .select("team_id, player_id, is_captain")
      .eq("tournament_id", tournamentId)
      .is("left_on", null),
    listPlayers(),
  ]);

  if (teams.error) throw teams.error;
  if (memberships.error) throw memberships.error;

  const roster = new Set(rosterPlayerIds);
  const onTeam = new Set(memberships.data.map((m) => m.player_id));
  const rosterPlayers = players.filter((player) => roster.has(player.id) || onTeam.has(player.id));

  return buildSquads({
    teams: teams.data,
    memberships: memberships.data.map((m) => ({
      teamId: m.team_id,
      playerId: m.player_id,
      isCaptain: m.is_captain,
    })),
    players: rosterPlayers,
    squadSize,
    excludeFromUnassigned: sharedKeeperIds,
  });
}
