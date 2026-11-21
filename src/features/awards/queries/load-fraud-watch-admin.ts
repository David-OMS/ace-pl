import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { AwardsPlayerOption, AwardsTeamOption, FraudWatchRow } from "./awards-admin-types";

export type FraudWatchAdmin = {
  open: FraudWatchRow[];
  history: FraudWatchRow[];
  players: AwardsPlayerOption[];
  teams: AwardsTeamOption[];
};

/** Fraud Watch is global. It does not wait for a tournament. */
export async function loadFraudWatchAdmin(): Promise<FraudWatchAdmin> {
  const supabase = await createSupabaseServerClient();
  const [fraud, players, teams] = await Promise.all([
    supabase
      .from("fraud_watch_entries")
      .select("id, player_id, team_id, caption, started_on, ended_on, players(name), teams(name)")
      .order("started_on", { ascending: false }),
    supabase.from("players").select("id, name").eq("is_active", true).order("name"),
    supabase.from("teams").select("id, name").order("name"),
  ]);

  if (fraud.error) throw fraud.error;
  if (players.error) throw players.error;
  if (teams.error) throw teams.error;

  const rows: FraudWatchRow[] = (fraud.data ?? []).map((row) => {
    const playerName = row.players?.name ?? null;
    const teamName = row.teams?.name ?? null;
    return {
      id: row.id,
      playerId: row.player_id,
      playerName,
      teamId: row.team_id,
      teamName,
      subjectName: teamName ?? playerName ?? "?",
      caption: row.caption,
      startedOn: row.started_on,
      endedOn: row.ended_on,
    };
  });

  return {
    open: rows.filter((row) => row.endedOn === null),
    history: rows.filter((row) => row.endedOn !== null),
    players: (players.data ?? []).map((player) => ({ id: player.id, name: player.name })),
    teams: (teams.data ?? []).map((team) => ({ id: team.id, name: team.name })),
  };
}
