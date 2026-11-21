import type { AutoAwardsResult } from "../domain/calculate-auto-awards";

export type FraudWatchRow = {
  id: string;
  playerId: string | null;
  playerName: string | null;
  teamId: string | null;
  teamName: string | null;
  subjectName: string;
  caption: string | null;
  startedOn: string;
  endedOn: string | null;
};

export type AwardsPlayerOption = {
  id: string;
  name: string;
};

export type AwardsTeamOption = {
  id: string;
  name: string;
};

export type BallonRoundView = {
  id: string;
  status: "closed" | "open" | "revealed";
  votingClosesAt: string | null;
  shortlist: { playerId: string; name: string; statsScore: number }[];
  voteCount: number;
};

export type AwardsAdminSnapshot = {
  tournamentId: string;
  tournamentName: string;
  fraudOpen: FraudWatchRow[];
  fraudHistory: FraudWatchRow[];
  roster: AwardsPlayerOption[];
  autoAwards: AutoAwardsResult;
  ballon: BallonRoundView | null;
  shortlistPreview: { playerId: string; name: string; statsScore: number }[];
};
