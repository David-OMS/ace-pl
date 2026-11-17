import type { PickablePlayer } from "../queries/list-pickable-players";
import type { CreateFantasyTeamInput } from "../schemas/create-team-schema";
import { validateSquad } from "../domain/validate-squad";

export function buildValidatedSquadPicks(args: {
  picks: CreateFantasyTeamInput["picks"];
  pool: readonly PickablePlayer[];
  formation: string;
  squadSize: number;
  budget: number;
}): ReturnType<typeof validateSquad> {
  const byId = new Map(args.pool.map((p) => [p.id, p]));
  const squadPicks = args.picks.map((pick) => {
    const player = byId.get(pick.playerId);
    return {
      playerId: pick.playerId,
      position: player?.position ?? ("MID" as const),
      price: player?.price ?? 0,
      isBench: pick.isBench,
      isCaptain: pick.isCaptain,
      isVice: pick.isVice,
      known: Boolean(player),
    };
  });

  if (squadPicks.some((p) => !p.known)) {
    return { ok: false, error: "bad_formation" };
  }

  return validateSquad({
    formation: args.formation,
    squadSize: args.squadSize,
    budget: args.budget,
    picks: squadPicks,
  });
}
