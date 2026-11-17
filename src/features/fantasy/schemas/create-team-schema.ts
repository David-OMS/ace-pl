import { z } from "zod";

import { FANTASY_FORMATIONS } from "@/config/fantasy";

const pickSchema = z.object({
  playerId: z.uuid(),
  isBench: z.boolean(),
  isCaptain: z.boolean(),
  isVice: z.boolean(),
});

export const createFantasyTeamSchema = z.object({
  tournamentId: z.uuid(),
  name: z.string().trim().min(1).max(40),
  formation: z.enum(FANTASY_FORMATIONS),
  picks: z.array(pickSchema).min(1),
});

export type CreateFantasyTeamInput = z.infer<typeof createFantasyTeamSchema>;

export function readCreateFantasyTeamForm(formData: FormData): unknown {
  const picksRaw = formData.get("picks");
  let picks: unknown = [];
  if (typeof picksRaw === "string" && picksRaw.length > 0) {
    try {
      picks = JSON.parse(picksRaw);
    } catch {
      picks = [];
    }
  }
  return {
    tournamentId: formData.get("tournamentId"),
    name: formData.get("name"),
    formation: formData.get("formation"),
    picks,
  };
}
