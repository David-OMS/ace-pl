import "server-only";

import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { calculateForm, type FormResult } from "../domain/calculate-form";
import { loadPublicTeamFormInputs } from "./load-public-team-form-inputs";

export type PublicTeamPlayer = {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  isCaptain: boolean;
};

export type PublicTeamPage = {
  teamId: string;
  teamName: string;
  teamColor: string;
  tournamentId: string;
  tournamentName: string;
  form: FormResult[];
  squad: PublicTeamPlayer[];
};

export async function getPublicTeamPage(teamId: string): Promise<PublicTeamPage | null> {
  const supabase = createPublicSupabaseClient();
  const { data: team, error } = await supabase
    .from("teams")
    .select("id, name, color, tournament_id, tournaments!inner(id, name)")
    .eq("id", teamId)
    .maybeSingle();
  if (error) throw error;
  if (!team) return null;

  const { memberships, standingFixtures } = await loadPublicTeamFormInputs(
    team.tournament_id,
    teamId,
  );
  const formRows = calculateForm({
    teamIds: [teamId],
    fixtures: standingFixtures,
  });

  return {
    teamId: team.id,
    teamName: team.name,
    teamColor: team.color ?? DEFAULT_TEAM_COLOR,
    tournamentId: team.tournament_id,
    tournamentName: team.tournaments.name,
    form: formRows[0]?.results ?? [],
    squad: memberships.map((row) => ({
      id: row.players.id,
      name: row.players.name,
      position: row.players.position,
      photoUrl: playerPhotoUrl(row.players.photo_path),
      isCaptain: row.is_captain,
    })),
  };
}
