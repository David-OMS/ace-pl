import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { calculatePlayerFantasyPoints, loadFanStatScope } from "@/features/fan-players";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { ballonShortlist } from "../domain/ballon-shortlist";
import { calculateAutoAwards } from "../domain/calculate-auto-awards";

import type { AwardsAdminSnapshot, BallonRoundView, FraudWatchRow } from "./awards-admin-types";

export type {
  AwardsAdminSnapshot,
  AwardsPlayerOption,
  BallonRoundView,
  FraudWatchRow,
} from "./awards-admin-types";

// eslint-disable-next-line max-lines-per-function, complexity -- aggregates fraud, roster, ballon
export async function loadAwardsAdminSnapshot(
  tournamentId: string,
  tournamentName: string,
): Promise<AwardsAdminSnapshot> {
  const supabase = await createSupabaseServerClient();
  const [fraud, roster, scope, round] = await Promise.all([
    supabase
      .from("fraud_watch_entries")
      .select("id, player_id, caption, started_on, ended_on, players!inner(name)")
      .eq("tournament_id", tournamentId)
      .order("started_on", { ascending: false }),
    supabase
      .from("tournament_players")
      .select("player_id, players!inner(id, name, position)")
      .eq("tournament_id", tournamentId),
    loadFanStatScope(tournamentId),
    supabase
      .from("ballon_dor_rounds")
      .select("id, status, voting_closes_at")
      .eq("tournament_id", tournamentId)
      .maybeSingle(),
  ]);

  if (fraud.error) throw fraud.error;
  if (roster.error) throw roster.error;
  if (round.error) throw round.error;

  const fraudRows: FraudWatchRow[] = (fraud.data ?? []).map((row) => ({
    id: row.id,
    playerId: row.player_id,
    playerName: row.players.name,
    caption: row.caption,
    startedOn: row.started_on,
    endedOn: row.ended_on,
  }));

  const rosterPlayers = (roster.data ?? []).map((row) => ({
    id: row.players.id,
    name: row.players.name,
    position: row.players.position as PlayerPosition,
  }));

  const namedStats = rosterPlayers.map((player) => {
    const totals = scope.totals.find((t) => t.playerId === player.id);
    const goalsConceded = scope.goalsConceded.get(player.id) ?? 0;
    const base = totals ?? {
      playerId: player.id,
      apps: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      saves: 0,
      motm: 0,
      ownGoals: 0,
      penaltySaves: 0,
    };
    return {
      ...base,
      name: player.name,
      goalsConceded,
      statsScore: calculatePlayerFantasyPoints(player.position, {
        ...base,
        goalsConceded,
      }),
    };
  });

  const autoAwards = calculateAutoAwards(namedStats);
  const shortlistPreview = ballonShortlist(
    namedStats.map((r) => ({
      playerId: r.playerId,
      name: r.name,
      statsScore: r.statsScore,
    })),
  );

  let ballon: BallonRoundView | null = null;
  if (round.data) {
    const [shortlist, votes] = await Promise.all([
      supabase
        .from("ballon_dor_shortlist")
        .select("player_id, stats_score, players!inner(name)")
        .eq("round_id", round.data.id)
        .order("stats_score", { ascending: false }),
      supabase
        .from("ballon_dor_votes")
        .select("voter_id", { count: "exact", head: true })
        .eq("round_id", round.data.id),
    ]);
    if (shortlist.error) throw shortlist.error;
    if (votes.error) throw votes.error;
    ballon = {
      id: round.data.id,
      status: round.data.status,
      votingClosesAt: round.data.voting_closes_at,
      shortlist: (shortlist.data ?? []).map((row) => ({
        playerId: row.player_id,
        name: row.players.name,
        statsScore: row.stats_score,
      })),
      voteCount: votes.count ?? 0,
    };
  }

  return {
    tournamentId,
    tournamentName,
    fraudOpen: fraudRows.filter((r) => r.endedOn === null),
    fraudHistory: fraudRows.filter((r) => r.endedOn !== null),
    roster: rosterPlayers.map((p) => ({ id: p.id, name: p.name })),
    autoAwards,
    ballon,
    shortlistPreview,
  };
}
