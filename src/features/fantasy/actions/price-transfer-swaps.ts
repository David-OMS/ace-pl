import { applyTransfer } from "../domain/apply-transfer";
import type { PickablePlayer } from "../queries/list-pickable-players";

export type PricedSwap = {
  playerOutId: string;
  playerInId: string;
  outPrice: number;
  inPrice: number;
  pointCost: number;
};

export type PricedBatch = {
  bank: number;
  freeTransfers: number;
  totalHit: number;
  swaps: PricedSwap[];
};

export function priceTransferSwaps(args: {
  swaps: readonly { playerOutId: string; playerInId: string }[];
  pool: readonly PickablePlayer[];
  bank: number;
  freeTransfers: number;
  isUnlimited: boolean;
}): PricedBatch | null {
  if (args.swaps.length === 0) {
    return {
      bank: args.bank,
      freeTransfers: args.freeTransfers,
      totalHit: 0,
      swaps: [],
    };
  }

  const priceById = new Map(args.pool.map((p) => [p.id, p.price]));
  let bank = args.bank;
  let freeTransfers = args.freeTransfers;
  let totalHit = 0;
  const priced: PricedSwap[] = [];

  for (const swap of args.swaps) {
    const outPrice = priceById.get(swap.playerOutId);
    const inPrice = priceById.get(swap.playerInId);
    if (outPrice === undefined || inPrice === undefined) return null;

    const step = applyTransfer({
      bank,
      freeTransfers,
      outPrice,
      inPrice,
      isUnlimited: args.isUnlimited,
    });
    if (!step.ok) return null;

    bank = step.value.bank;
    freeTransfers = step.value.freeTransfers;
    totalHit += step.value.pointCost;
    priced.push({ ...swap, outPrice, inPrice, pointCost: step.value.pointCost });
  }

  return { bank, freeTransfers, totalHit, swaps: priced };
}
