import { FANTASY_EXTRA_TRANSFER_HIT } from "@/config/fantasy";

export type ApplyTransferInput = {
  bank: number;
  freeTransfers: number;
  outPrice: number;
  inPrice: number;
  isUnlimited: boolean;
};

export type ApplyTransferOk = {
  bank: number;
  freeTransfers: number;
  pointCost: number;
};

export type ApplyTransferResult =
  { ok: true; value: ApplyTransferOk } | { ok: false; error: "insufficient_funds" };

/** One swap: bank + out price must cover in price; −5 after free transfers. */
export function applyTransfer(input: ApplyTransferInput): ApplyTransferResult {
  const bank = input.bank + input.outPrice - input.inPrice;
  if (bank < 0) return { ok: false, error: "insufficient_funds" };

  if (input.isUnlimited) {
    return {
      ok: true,
      value: { bank, freeTransfers: input.freeTransfers, pointCost: 0 },
    };
  }

  if (input.freeTransfers > 0) {
    return {
      ok: true,
      value: {
        bank,
        freeTransfers: input.freeTransfers - 1,
        pointCost: 0,
      },
    };
  }

  return {
    ok: true,
    value: {
      bank,
      freeTransfers: 0,
      pointCost: FANTASY_EXTRA_TRANSFER_HIT,
    },
  };
}

export function applyTransferBatch(
  start: Omit<ApplyTransferInput, "outPrice" | "inPrice">,
  swaps: readonly { outPrice: number; inPrice: number }[],
): ApplyTransferResult & { totalPointCost?: number } {
  let bank = start.bank;
  let freeTransfers = start.freeTransfers;
  let totalPointCost = 0;

  for (const swap of swaps) {
    const result = applyTransfer({
      bank,
      freeTransfers,
      outPrice: swap.outPrice,
      inPrice: swap.inPrice,
      isUnlimited: start.isUnlimited,
    });
    if (!result.ok) return result;
    bank = result.value.bank;
    freeTransfers = result.value.freeTransfers;
    totalPointCost += result.value.pointCost;
  }

  return {
    ok: true,
    value: { bank, freeTransfers, pointCost: totalPointCost },
    totalPointCost,
  };
}
