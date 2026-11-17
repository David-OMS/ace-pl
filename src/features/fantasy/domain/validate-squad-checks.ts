import type { PlayerPosition } from "@/config/player-positions";

import type { SquadPickInput, ValidateSquadError } from "./validate-squad";
import type { FormationCounts } from "./parse-formation";

export function checkCaptains(picks: readonly SquadPickInput[]): ValidateSquadError | null {
  const captains = picks.filter((p) => p.isCaptain);
  const vices = picks.filter((p) => p.isVice);
  if (captains.length !== 1) return "need_one_captain";
  if (vices.length !== 1) return "need_one_vice";
  if (captains[0]?.playerId === vices[0]?.playerId) return "captain_is_vice";
  if (captains[0]?.isBench || vices[0]?.isBench) return "bench_captain";
  return null;
}

export function checkShape(
  picks: readonly SquadPickInput[],
  formation: FormationCounts,
  squadSize: number,
): ValidateSquadError | null {
  const starters = picks.filter((p) => !p.isBench);
  const bench = picks.filter((p) => p.isBench);
  if (starters.length !== formation.starters) return "wrong_outfield";
  if (bench.length !== squadSize - formation.starters) return "wrong_squad_size";

  const gk = starters.filter((p) => p.position === "GK");
  if (gk.length !== 1) return "wrong_gk";
  if (bench.some((p) => p.position === "GK")) return "wrong_gk";

  const count = (pos: PlayerPosition): number => starters.filter((p) => p.position === pos).length;
  if (
    count("DEF") !== formation.def ||
    count("MID") !== formation.mid ||
    count("FWD") !== formation.fwd
  ) {
    return "wrong_outfield";
  }
  return null;
}
