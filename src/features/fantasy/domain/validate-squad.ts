import { remainingBank } from "./fantasy-budget";
import { parseFormation } from "./parse-formation";
import { checkCaptains, checkShape } from "./validate-squad-checks";
import type { PlayerPosition } from "@/config/player-positions";

export type SquadPickInput = {
  playerId: string;
  position: PlayerPosition;
  price: number;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
};

export type ValidateSquadInput = {
  formation: string;
  squadSize: number;
  budget: number;
  picks: readonly SquadPickInput[];
};

export type ValidateSquadError =
  | "bad_formation"
  | "wrong_squad_size"
  | "duplicate_player"
  | "need_one_captain"
  | "need_one_vice"
  | "captain_is_vice"
  | "bench_captain"
  | "wrong_gk"
  | "wrong_outfield"
  | "over_budget";

export type ValidateSquadOk = {
  bank: number;
  budget: number;
  spent: number;
};

export type ValidateSquadResult =
  { ok: true; value: ValidateSquadOk } | { ok: false; error: ValidateSquadError };

export function validateSquad(input: ValidateSquadInput): ValidateSquadResult {
  const formation = parseFormation(input.formation);
  if (!formation) return { ok: false, error: "bad_formation" };
  if (input.picks.length !== input.squadSize) {
    return { ok: false, error: "wrong_squad_size" };
  }

  const ids = input.picks.map((p) => p.playerId);
  if (new Set(ids).size !== ids.length) return { ok: false, error: "duplicate_player" };

  const captainError = checkCaptains(input.picks);
  if (captainError) return { ok: false, error: captainError };

  const shapeError = checkShape(input.picks, formation, input.squadSize);
  if (shapeError) return { ok: false, error: shapeError };

  const spent = input.picks.reduce((sum, p) => sum + p.price, 0);
  if (spent > input.budget) return { ok: false, error: "over_budget" };

  return {
    ok: true,
    value: {
      bank: remainingBank(input.budget, spent),
      budget: input.budget,
      spent,
    },
  };
}
