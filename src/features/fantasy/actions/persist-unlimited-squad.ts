import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { assignSlotsFromSquad } from "../domain/assign-slots-from-squad";
import { validateSquad } from "../domain/validate-squad";
import type { PickablePlayer } from "../queries/list-pickable-players";

type SquadPick = {
  playerId: string;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

export async function persistUnlimitedSquad(args: {
  teamId: string;
  formation: FantasyFormation;
  budget: number;
  squad: readonly SquadPick[];
  pool: readonly PickablePlayer[];
}): Promise<"ok" | "save_failed" | "invalid_input"> {
  const byId = new Map(args.pool.map((p) => [p.id, p]));
  const resolved = args.squad.flatMap((pick) => {
    const player = byId.get(pick.playerId);
    if (!player) return [];
    return [
      {
        playerId: pick.playerId,
        position: player.position,
        price: player.price,
        isBench: pick.isBench,
        isCaptain: pick.isCaptain,
        isVice: pick.isVice,
      },
    ];
  });
  if (resolved.length !== args.squad.length) return "invalid_input";

  const validated = validateSquad({
    formation: args.formation,
    squadSize: FANTASY_SQUAD_SIZE,
    budget: args.budget,
    picks: resolved,
  });
  if (!validated.ok) return "invalid_input";

  const slotted = assignSlotsFromSquad({
    formation: args.formation,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: resolved,
  });
  if (!slotted) return "invalid_input";

  return writeUnlimitedSquad({
    teamId: args.teamId,
    formation: args.formation,
    bank: validated.value.bank,
    slotted,
  });
}

async function writeUnlimitedSquad(args: {
  teamId: string;
  formation: FantasyFormation;
  bank: number;
  slotted: NonNullable<ReturnType<typeof assignSlotsFromSquad>>;
}): Promise<"ok" | "save_failed"> {
  const supabase = await createSupabaseServerClient();
  const { error: deleteError } = await supabase
    .from("fantasy_picks")
    .delete()
    .eq("team_id", args.teamId);
  if (deleteError) {
    logger.error("unlimited_squad_clear_failed", { error: deleteError });
    return "save_failed";
  }

  const { error: insertError } = await supabase.from("fantasy_picks").insert(
    args.slotted.map((pick) => ({
      team_id: args.teamId,
      player_id: pick.playerId,
      slot: pick.slot,
      is_bench: pick.isBench,
      is_captain: pick.isCaptain,
      is_vice: pick.isVice,
      purchase_price: pick.price,
    })),
  );
  if (insertError) {
    logger.error("unlimited_squad_insert_failed", { error: insertError });
    return "save_failed";
  }

  const { error: updateError } = await supabase
    .from("fantasy_teams")
    .update({ formation: args.formation, bank: args.bank })
    .eq("id", args.teamId);
  if (updateError) {
    logger.error("unlimited_squad_team_failed", { error: updateError });
    return "save_failed";
  }
  return "ok";
}
