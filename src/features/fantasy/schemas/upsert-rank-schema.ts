import { z } from "zod";

export const upsertFantasyRankSchema = z.object({
  tournamentId: z.uuid(),
  playerId: z.uuid(),
  rank: z.enum(["S", "A", "B", "C"]),
});

export type UpsertFantasyRankInput = z.infer<typeof upsertFantasyRankSchema>;

export function readUpsertRankForm(formData: FormData): unknown {
  return {
    tournamentId: formData.get("tournamentId"),
    playerId: formData.get("playerId"),
    rank: formData.get("rank"),
  };
}
