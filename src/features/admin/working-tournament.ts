import type { TournamentStatus } from "@/config/tournament-rules";

export type WorkingTournament = {
  id: string;
  name: string;
  status: TournamentStatus;
};
