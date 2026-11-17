import "server-only";

import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { buildSquadRows } from "./build-squad-rows";

type FixtureRef = {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
};

export async function seedFixtureSquad(fixture: FixtureRef): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: members, error: membersError } = await supabase
    .from("team_memberships")
    .select("player_id, team_id")
    .eq("tournament_id", fixture.tournament_id)
    .in("team_id", [fixture.home_team_id, fixture.away_team_id])
    .is("left_on", null);

  if (membersError || !members?.length) {
    if (membersError) logger.error("seed_squad_members_failed", { error: membersError });
    return;
  }

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, position")
    .in(
      "id",
      members.map((m) => m.player_id),
    );
  if (playersError) {
    logger.error("seed_squad_players_failed", { error: playersError });
    return;
  }

  const { error } = await supabase.from("match_participations").upsert(
    buildSquadRows({
      tournamentId: fixture.tournament_id,
      fixtureId: fixture.id,
      members,
      players: players ?? [],
    }),
    { onConflict: "fixture_id,player_id", ignoreDuplicates: true },
  );
  if (error) logger.error("seed_squad_upsert_failed", { error });
}
