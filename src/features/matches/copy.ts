import type { MatchEventType, ParticipationStatus } from "@/config/match-events";
import type { ActionErrorCode } from "@/lib/action-result";

export const matchesCopy = {
  title: "Match entry",
  back: "Fixtures",
  home: "Home",
  away: "Away",
  score: "Score",
  whoPlayed: "Lineups",
  whoPlayedHint: "Tap = absent",
  emptySquad: "No squad loaded for this match yet.",
  loadSquads: "Load squads",
  loadingSquads: "Loading…",
  borrow: "Borrow / fill-in",
  borrowSubmit: "Add",
  loan: "Loan",
  keeper: "Goalkeeper",
  captain: "Captain",
  captainMark: "C",
  events: "Events",
  noEvents: "No events yet.",
  publish: "Publish result",
  publishing: "Publishing…",
  published: "Result published.",
  walkover: "Walkover 3–0",
  locked: "This match is locked.",
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
  form: {
    type: "Event",
    player: "Player",
    assist: "Assist",
    assistNone: "None",
    saves: "Saves",
    add: "Add event",
    adding: "Adding…",
    remove: "Remove",
  },
  actionErrors: {
    invalid_input: "Check the form.",
    unauthenticated: "Your session has ended. Sign in again.",
    forbidden: "Only admins can do that.",
    not_found: "That match was not found.",
    conflict: "Already set (e.g. MOTM).",
    save_failed: "Couldn't save. Try again.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
} as const;

export function describeMatchesError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = matchesCopy.actionErrors;
  return messages[code] ?? matchesCopy.fallbackError;
}
