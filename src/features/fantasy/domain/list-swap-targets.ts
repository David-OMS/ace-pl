import { canSwapPitchPicks } from "./can-swap-pitch-picks";

export type SwapTargetPick = {
  playerId: string;
  name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  isBench: boolean;
};

export function listSwapTargets(
  selected: SwapTargetPick,
  picks: readonly SwapTargetPick[],
): SwapTargetPick[] {
  return picks.filter((pick) => canSwapPitchPicks(selected, pick));
}
