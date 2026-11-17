import { z } from "zod";

import { FANTASY_FORMATIONS } from "@/config/fantasy";

const squadPickSchema = z.object({
  playerId: z.uuid(),
  isBench: z.boolean(),
  isCaptain: z.boolean(),
  isVice: z.boolean(),
});

export const applyFantasyTransfersSchema = z.object({
  teamId: z.uuid(),
  formation: z.enum(FANTASY_FORMATIONS),
  swaps: z
    .array(
      z.object({
        playerOutId: z.uuid(),
        playerInId: z.uuid(),
      }),
    )
    .max(15),
  squad: z.array(squadPickSchema).max(15).optional(),
});

export type ApplyFantasyTransfersInput = z.infer<typeof applyFantasyTransfersSchema>;

export function readTransfersForm(formData: FormData): unknown {
  const swapsRaw = formData.get("swaps");
  const squadRaw = formData.get("squad");
  let swaps: unknown = [];
  let squad: unknown;
  if (typeof swapsRaw === "string" && swapsRaw.length > 0) {
    try {
      swaps = JSON.parse(swapsRaw);
    } catch {
      swaps = [];
    }
  }
  if (typeof squadRaw === "string" && squadRaw.length > 0) {
    try {
      squad = JSON.parse(squadRaw);
    } catch {
      squad = undefined;
    }
  }
  return {
    teamId: formData.get("teamId"),
    formation: formData.get("formation"),
    swaps,
    squad,
  };
}
