import "server-only";

import { revalidatePath } from "next/cache";

import { adminFixturePath } from "@/features/fixtures";

/** Refresh the admin match page only — fantasy waits for Publish update. */
export async function revalidateAfterMatchEdit(input: {
  tournamentId: string;
  fixtureId: string;
}): Promise<void> {
  revalidatePath(adminFixturePath(input.tournamentId, input.fixtureId));
}
