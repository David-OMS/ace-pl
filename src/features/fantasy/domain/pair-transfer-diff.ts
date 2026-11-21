/** Pair removed players with incoming ones for transfer logging. */
export function pairTransferDiff(
  previousPlayerIds: readonly string[],
  nextPlayerIds: readonly string[],
): { playerOutId: string; playerInId: string }[] {
  const previous = new Set(previousPlayerIds);
  const next = new Set(nextPlayerIds);
  const outs = previousPlayerIds.filter((id) => !next.has(id));
  const ins = nextPlayerIds.filter((id) => !previous.has(id));
  const pairs: { playerOutId: string; playerInId: string }[] = [];
  const n = Math.min(outs.length, ins.length);
  for (let i = 0; i < n; i += 1) {
    const outId = outs[i];
    const inId = ins[i];
    if (!outId || !inId) continue;
    pairs.push({ playerOutId: outId, playerInId: inId });
  }
  return pairs;
}
