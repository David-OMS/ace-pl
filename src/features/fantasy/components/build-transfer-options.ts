import { formatFantasyPrice } from "../domain/format-fantasy-price";
import type { MyFantasyTeam } from "../queries/get-my-fantasy-team";
import type { PickablePlayer } from "../queries/list-pickable-players";
import type { SwapDraft } from "./use-transfer-draft";

export function buildOwnedIds(team: MyFantasyTeam, swaps: readonly SwapDraft[]): Set<string> {
  const owned = new Set([...team.picks.map((p) => p.playerId), ...swaps.map((s) => s.playerInId)]);
  for (const swap of swaps) owned.delete(swap.playerOutId);
  return owned;
}

export function buildOutOptions(
  team: MyFantasyTeam,
  swaps: readonly SwapDraft[],
): { value: string; label: string }[] {
  return team.picks
    .filter((p) => swaps.every((s) => s.playerOutId !== p.playerId))
    .map((p) => ({
      value: p.playerId,
      label: `${p.name} · ${formatFantasyPrice(p.price)}`,
    }));
}

export function buildInOptions(
  pool: readonly PickablePlayer[],
  owned: Set<string>,
): { value: string; label: string }[] {
  return pool
    .filter((p) => !owned.has(p.id))
    .slice()
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name))
    .map((p) => ({
      value: p.id,
      label: `${p.name} · ${p.position} · ${formatFantasyPrice(p.price)}`,
    }));
}
