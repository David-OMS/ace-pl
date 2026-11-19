import "server-only";

import { getTransferWindow } from "./get-transfer-window";

/**
 * Unlimited squad/formation edits until Thu 23:59 Lagos before the first game day.
 * After that the window is either locked (GW in progress) or open (1 free / GW).
 */
export async function isUnlimitedTransferPeriod(tournamentId: string): Promise<boolean> {
  return (await getTransferWindow(tournamentId)) === "unlimited";
}
