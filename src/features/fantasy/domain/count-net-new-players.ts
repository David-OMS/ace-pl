/** Players in the new squad that were not in the saved squad (market transfers). */
export function countNetNewPlayers(
  previousPlayerIds: readonly string[],
  nextPlayerIds: readonly string[],
): number {
  const previous = new Set(previousPlayerIds);
  let incoming = 0;
  for (const id of nextPlayerIds) {
    if (!previous.has(id)) incoming += 1;
  }
  return incoming;
}

export function transferHitForNetNew(args: {
  netNew: number;
  freeTransfers: number;
  hitPerExtra: number;
}): number {
  const extras = Math.max(0, args.netNew - args.freeTransfers);
  return extras * args.hitPerExtra;
}
