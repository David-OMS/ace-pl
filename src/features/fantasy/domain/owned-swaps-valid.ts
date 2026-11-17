export function ownedSwapsValid(
  ownedIds: ReadonlySet<string>,
  swaps: readonly { playerOutId: string; playerInId: string }[],
): boolean {
  for (const swap of swaps) {
    if (!ownedIds.has(swap.playerOutId) || ownedIds.has(swap.playerInId)) {
      return false;
    }
  }
  return true;
}
