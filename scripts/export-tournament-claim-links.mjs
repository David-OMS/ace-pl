import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
if (!url || !key || !site) throw new Error("missing env");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: active, error: activeError } = await supabase
  .from("tournaments")
  .select("id, name, status, created_at")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
if (activeError) throw activeError;

let tournament = active;
if (!tournament) {
  const { data: latest, error } = await supabase
    .from("tournaments")
    .select("id, name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  tournament = latest;
}
if (!tournament) throw new Error("no tournament");

const [roster, keepers, teams] = await Promise.all([
  supabase.from("tournament_players").select("player_id").eq("tournament_id", tournament.id),
  supabase.from("tournament_keepers").select("player_id").eq("tournament_id", tournament.id),
  supabase.from("teams").select("id").eq("tournament_id", tournament.id),
]);
if (roster.error) throw roster.error;
if (keepers.error) throw keepers.error;
if (teams.error) throw teams.error;

const teamIds = (teams.data ?? []).map((row) => row.id);
let squadIds = [];
if (teamIds.length > 0) {
  const { data, error } = await supabase
    .from("team_memberships")
    .select("player_id")
    .in("team_id", teamIds);
  if (error) throw error;
  squadIds = (data ?? []).map((row) => row.player_id);
}

const playerIds = [
  ...new Set([
    ...(roster.data ?? []).map((row) => row.player_id),
    ...(keepers.data ?? []).map((row) => row.player_id),
    ...squadIds,
  ]),
];
if (playerIds.length === 0) throw new Error("no players in tournament");

const { data: players, error: playersError } = await supabase
  .from("players")
  .select("id, name, profile_id, player_claim_tokens(token)")
  .in("id", playerIds)
  .order("name");
if (playersError) throw playersError;

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

const rows = [["name", "claim_link", "status"]];
for (const player of players ?? []) {
  const token = player.player_claim_tokens?.token ?? null;
  const claimLink = token ? `${site}/claim/${token}` : "";
  const status = player.profile_id ? "linked" : token ? "open" : "no_link";
  rows.push([player.name, claimLink, status]);
}

const csv = `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
const out = resolve("tournament-claim-links.csv");
writeFileSync(out, csv, "utf8");
console.log(
  JSON.stringify(
    {
      tournament: tournament.name,
      status: tournament.status,
      players: rows.length - 1,
      file: out,
    },
    null,
    2,
  ),
);
