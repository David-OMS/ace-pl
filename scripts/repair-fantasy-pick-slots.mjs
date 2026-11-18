/**
 * One-shot: rewrite fantasy_picks.slot / is_bench from real player positions.
 * Honours saved starter/bench flags when the shape still fits; otherwise reseats.
 * Teams with no GK (or a shape that cannot fill the formation) are reported, not forced.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const FORMATIONS = {
  "2-2-2": { def: 2, mid: 2, fwd: 2 },
  "2-3-1": { def: 2, mid: 3, fwd: 1 },
  "3-2-1": { def: 3, mid: 2, fwd: 1 },
  "3-1-2": { def: 3, mid: 1, fwd: 2 },
};

function buildSlots(formation) {
  const parsed = FORMATIONS[formation];
  if (!parsed) return [];
  const starters = [
    ...line("FWD", parsed.fwd),
    ...line("MID", parsed.mid),
    ...line("DEF", parsed.def),
    ...line("GK", 1),
  ];
  const bench = [
    { key: "BENCH-0", position: "MID", isBench: true },
    { key: "BENCH-1", position: "MID", isBench: true },
  ];
  return [...starters, ...bench];
}

function line(position, count) {
  return Array.from({ length: count }, (_, index) => ({
    key: `${position}-${index}`,
    position,
    isBench: false,
  }));
}

function assignSlots(formation, picks) {
  const slots = buildSlots(formation);
  if (slots.length === 0) return null;
  const unusedStarters = picks.filter((p) => !p.isBench);
  const unusedBench = picks.filter((p) => p.isBench);
  const placed = [];

  for (const slot of slots.filter((s) => !s.isBench)) {
    const index = unusedStarters.findIndex((p) => p.position === slot.position);
    if (index < 0) return null;
    const [player] = unusedStarters.splice(index, 1);
    placed.push({ ...player, slot: placed.length, isBench: false });
  }
  for (const slot of slots.filter((s) => s.isBench)) {
    const player = unusedBench.shift();
    if (!player || player.position === "GK") return null;
    placed.push({
      ...player,
      slot: placed.length,
      isBench: true,
      isCaptain: false,
      isVice: false,
    });
  }
  if (unusedStarters.length > 0 || unusedBench.length > 0) return null;
  return placed;
}

function reseat(formation, picks) {
  const slots = buildSlots(formation);
  const unused = [...picks];
  const placed = [];
  for (const slot of slots.filter((s) => !s.isBench)) {
    const index = unused.findIndex((p) => p.position === slot.position);
    if (index < 0) continue;
    const [player] = unused.splice(index, 1);
    placed.push({ ...player, slotKey: slot.key, isBench: false });
  }
  for (const slot of slots.filter((s) => s.isBench)) {
    const player = unused.shift();
    if (!player || player.position === "GK") continue;
    placed.push({
      ...player,
      slotKey: slot.key,
      isBench: true,
      isCaptain: false,
      isVice: false,
    });
  }
  if (placed.length !== picks.length) return null;
  return placed.map((pick, slot) => {
    const index = slots.findIndex((s) => s.key === pick.slotKey);
    return { ...pick, slot: index >= 0 ? index : slot };
  });
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const dryRun = process.argv.includes("--dry-run");

const { data: teams, error: teamsError } = await sb
  .from("fantasy_teams")
  .select("id, name, formation");
if (teamsError) throw teamsError;

const fixed = [];
const skipped = [];

for (const team of teams ?? []) {
  const { data: rows, error } = await sb
    .from("fantasy_picks")
    .select("player_id, slot, is_bench, is_captain, is_vice, purchase_price, players!inner(position)")
    .eq("team_id", team.id)
    .order("slot");
  if (error) throw error;

  const picks = (rows ?? []).map((row) => ({
    playerId: row.player_id,
    position: row.players.position,
    price: Number(row.purchase_price),
    isBench: row.is_bench,
    isCaptain: row.is_captain,
    isVice: row.is_vice,
    purchasePrice: Number(row.purchase_price),
  }));

  const hasGk = picks.some((p) => p.position === "GK");
  if (!hasGk) {
    skipped.push({ team: team.name, reason: "no_gk" });
    continue;
  }

  let next = assignSlots(team.formation, picks);
  let mode = "assign";
  if (!next) {
    next = reseat(team.formation, picks);
    mode = "reseat";
  }
  if (!next) {
    skipped.push({ team: team.name, reason: "cannot_fill_formation" });
    continue;
  }

  const matched = next.every((pick) => {
    const row = rows.find((r) => r.player_id === pick.playerId);
    return row && row.slot === pick.slot && row.is_bench === pick.isBench;
  });
  if (matched) continue;

  fixed.push({ team: team.name, mode, formation: team.formation });
  if (dryRun) continue;

  const { error: clearError } = await sb.from("fantasy_picks").delete().eq("team_id", team.id);
  if (clearError) throw clearError;
  const { error: insertError } = await sb.from("fantasy_picks").insert(
    next.map((pick) => ({
      team_id: team.id,
      player_id: pick.playerId,
      slot: pick.slot,
      is_bench: pick.isBench,
      is_captain: pick.isCaptain,
      is_vice: pick.isVice,
      purchase_price: pick.purchasePrice ?? pick.price,
    })),
  );
  if (insertError) throw insertError;
}

console.log(JSON.stringify({ dryRun, fixed, skipped }, null, 2));
