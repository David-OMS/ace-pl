import type { FixtureStatus } from "@/config/fixture-status";
import type { MatchEventType, ParticipationStatus } from "@/config/match-events";

export const fanFixturesCopy = {
  title: "Fixtures",
  back: "Fixtures",
  noTournament: "No tournament yet.",
  emptyDay: "No matches on this day.",
  emptyPast: "No results yet.",
  upcomingPill: "Upcoming",
  pastPill: "Full time",
  sections: {
    upcoming: (dayLabel: string): string => dayLabel,
    past: (dayLabel: string): string => dayLabel,
  },
  gameDayChip: (gameweek: number, dateLabel: string): string =>
    gameweek > 0 ? `GW ${gameweek} · ${dateLabel}` : dateLabel,
  detailTitle: "Match",
  lineups: "Lineups",
  events: "Events",
  noEvents: "No events recorded yet.",
  noLineups: "Squads are not set yet.",
  emptySquad: "No players listed yet.",
  loan: "Loan",
  keeper: "Goalkeeper",
  borrowNote: (playerName: string, fromTeam: string, forTeam: string): string =>
    `${playerName} — borrowed from ${fromTeam}, played for ${forTeam}`,
  participation: {
    played: "Played",
    unused_sub: "Sub",
    absent: "Absent",
  } satisfies Record<ParticipationStatus, string>,
  eventTypes: {
    goal: "Goal",
    own_goal: "Own goal",
    saves: "Saves",
    penalty_save: "Penalty save",
    yellow_card: "Yellow",
    red_card: "Red",
    motm: "MOTM",
  } satisfies Record<MatchEventType, string>,
  statuses: {
    draft: "Draft",
    published: "Scheduled",
    completed: "Played",
    postponed: "Postponed",
    void: "Void",
    walkover: "Walkover",
  } satisfies Record<FixtureStatus, string>,
  scoreFromGoals: "From goals",
  notFound: "That match was not found.",
} as const;
