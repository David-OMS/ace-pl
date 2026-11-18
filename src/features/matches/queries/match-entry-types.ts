import type { FixtureStatus } from "@/config/fixture-status";
import type { MatchEventType, ParticipationStatus } from "@/config/match-events";
import type { PlayerPosition } from "@/config/player-positions";

export type MatchPlayer = {
  participationId: string;
  playerId: string;
  name: string;
  position: PlayerPosition;
  teamId: string;
  status: ParticipationStatus;
  isGoalkeeper: boolean;
  isBorrowed: boolean;
  isCaptain: boolean;
};

export type MatchEventRow = {
  id: string;
  eventType: MatchEventType;
  playerId: string;
  playerName: string;
  assistPlayerId: string | null;
  assistPlayerName: string | null;
  quantity: number;
  sortOrder: number;
};

export type MatchEntry = {
  fixtureId: string;
  tournamentId: string;
  status: FixtureStatus;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamColor: string;
  kickoffTime: string;
  gameDayLabel: string;
  homePlayers: MatchPlayer[];
  awayPlayers: MatchPlayer[];
  homeBorrowPool: { id: string; name: string; position: PlayerPosition }[];
  awayBorrowPool: { id: string; name: string; position: PlayerPosition }[];
  events: MatchEventRow[];
  score: { homeGoals: number; awayGoals: number };
  isLocked: boolean;
};
