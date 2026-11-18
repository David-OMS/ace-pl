import { z } from "zod";

import { FANTASY_TEAM_NAME_MAX_LENGTH } from "@/config/fantasy";

export const renameFantasyTeamSchema = z.object({
  teamId: z.uuid(),
  name: z.string().trim().min(1).max(FANTASY_TEAM_NAME_MAX_LENGTH),
});

export function readRenameFantasyTeamForm(formData: FormData): unknown {
  return {
    teamId: formData.get("teamId"),
    name: formData.get("name"),
  };
}
