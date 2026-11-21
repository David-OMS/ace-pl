import { pairTransferDiff } from "../domain/pair-transfer-diff";

import type { SwapDraft } from "./swap-draft";

export function draftMarketSwaps(args: {
  previousPlayerIds: readonly string[];
  nextPlayerIds: readonly string[];
  isUnlimited: boolean;
  fallback: readonly SwapDraft[];
}): SwapDraft[] {
  if (args.isUnlimited) return [];
  const fromDiff = pairTransferDiff(args.previousPlayerIds, args.nextPlayerIds);
  return fromDiff.length > 0 ? fromDiff : [...args.fallback];
}
