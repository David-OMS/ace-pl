import { z } from "zod";

import { PLAYER_POSITIONS } from "@/config/player-positions";

const NAME_MAX_LENGTH = 40;

export const playerInputSchema = z.object({
  name: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  position: z.enum(PLAYER_POSITIONS),
});

export type PlayerInput = z.infer<typeof playerInputSchema>;

export function readPlayerForm(formData: FormData): unknown {
  return {
    name: formData.get("name"),
    position: formData.get("position"),
  };
}
