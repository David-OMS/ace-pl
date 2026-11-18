import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("missing env");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FIXTURES = [
  { date: "2026-11-20", time: "18:30", home: "Aura FC", away: "Red Sharks" },
  { date: "2026-11-20", time: "18:55", home: "Bluegold FC", away: "All Stars FC" },
  { date: "2026-11-20", time: "19:25", home: "The Predators", away: "Red Sharks" },
  { date: "2026-11-20", time: "19:50", home: "Bluegold FC", away: "Aura FC" },
  { date: "2026-11-27", time: "18:30", home: "All Stars FC", away: "The Predators" },
  { date: "2026-11-27", time: "18:55", home: "Red Sharks", away: "Bluegold FC" },
  { date: "2026-11-27", time: "19:25", home: "All Stars FC", away: "Aura FC" },
  { date: "2026-11-27", time: "19:50", home: "The Predators", away: "Bluegold FC" },
  { date: "2026-12-04", time: "18:30", home: "Aura FC", away: "Red Sharks" },
  { date: "2026-12-04", time: "18:55", home: "Bluegold FC", away: "All Stars FC" },
  { date: "2026-12-04", time: "19:25", home: "Aura FC", away: "The Predators" },
  { date: "2026-12-04", time: "19:55", home: "Red Sharks", away: "All Stars FC" },
  { date: "2026-12-11", time: "18:30", home: "Bluegold FC", away: "Aura FC" },
  { date: "2026-12-11", time: "18:55", home: "The Predators", away: "Red Sharks" },
  { date: "2026-12-11", time: "19:25", home: "All Stars FC", away: "Aura FC" },
  { date: "2026-12-11", time: "19:50", home: "The Predators", away: "Bluegold FC" },
  { date: "2026-12-18", time: "18:30", home: "All Stars FC", away: "The Predators" },
  { date: "2026-12-18", time: "18:55", home: "Red Sharks", away: "Bluegold FC" },
  { date: "2026-12-18", time: "19:25", home: "Aura FC", away: "The Predators" },
  { date: "2026-12-18", time: "19:55", home: "Red Sharks", away: "All Stars FC" },
];

const { data: active, error: activeError } = await supabase
  .from("tournaments")
  .select("id, name, status")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
if (activeError) throw activeError;

let tournament = active;
if (!tournament) {
  const { data: latest, error } = await supabase
    .from("tournaments")
    .select("id, name, status")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  tournament = latest;
}
if (!tournament) throw new Error("no tournament");

const { data: teams, error: teamsError } = await supabase
  .from("teams")
  .select("id, name")
  .eq("tournament_id", tournament.id);
if (teamsError) throw teamsError;

const teamIdByName = new Map((teams ?? []).map((team) => [team.name, team.id]));
for (const row of FIXTURES) {
  if (!teamIdByName.has(row.home) || !teamIdByName.has(row.away)) {
    throw new Error(`missing team: ${row.home} or ${row.away}`);
  }
}

const dates = [...new Set(FIXTURES.map((row) => row.date))];
const gameDayIdByDate = new Map();
for (const playedOn of dates) {
  const existing = await supabase
    .from("game_days")
    .select("id")
    .eq("tournament_id", tournament.id)
    .eq("played_on", playedOn)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) {
    gameDayIdByDate.set(playedOn, existing.data.id);
    continue;
  }
  const inserted = await supabase
    .from("game_days")
    .insert({ tournament_id: tournament.id, played_on: playedOn })
    .select("id")
    .single();
  if (inserted.error) throw inserted.error;
  gameDayIdByDate.set(playedOn, inserted.data.id);
}

const { data: removed, error: removeError } = await supabase
  .from("fixtures")
  .delete()
  .eq("tournament_id", tournament.id)
  .select("id");
if (removeError) throw removeError;

const rows = FIXTURES.map((row) => ({
  tournament_id: tournament.id,
  game_day_id: gameDayIdByDate.get(row.date),
  home_team_id: teamIdByName.get(row.home),
  away_team_id: teamIdByName.get(row.away),
  kickoff_time: `${row.time}:00`,
  status: "published",
}));

const { data: inserted, error: insertError } = await supabase
  .from("fixtures")
  .insert(rows)
  .select("id");
if (insertError) throw insertError;

console.log(
  JSON.stringify(
    {
      tournament: tournament.name,
      removed: removed?.length ?? 0,
      inserted: inserted?.length ?? 0,
      gameDays: dates,
    },
    null,
    2,
  ),
);
