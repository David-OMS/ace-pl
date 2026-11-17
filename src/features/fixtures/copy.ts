import type { FixtureStatus } from "@/config/fixture-status";
import type { ActionErrorCode } from "@/lib/action-result";

export const fixturesCopy = {
  title: "Fixtures",
  manageTitle: "Manage fixtures",
  generateTitle: "Generate fixtures",
  empty: "No fixtures yet.",
  emptyGameDay: "No matches on this day.",
  todayTitle: "Today",
  dayPublished: "Published",
  dayDraft: "Draft",
  gameweekHeading: (gw: number, dateLabel: string): string =>
    gw > 0 ? `GM${gw} · ${dateLabel}` : dateLabel,
  form: {
    gameDay: "Game day",
    homeTeam: "Home",
    awayTeam: "Away",
    kickoffTime: "Kick-off",
    add: "Add fixture",
    adding: "Adding…",
  },
  generateAll: "Generate all fixtures",
  generateFill: "Fill remaining fixtures",
  generating: "Generating…",
  generateHintEmpty:
    "Double round-robin. Unfinished teams first each day; a same-day sit-out meets an early/rested side, not the team that just played. New day: sit-outs open, any opponent is fine.",
  generateHintFill: "Adds missing pairs only. Same day/rest rules as generate-all.",

  undatedTitle: "No date",
  undatedPill: "Postponed",
  undatedHint: "Open the match to set a date and kick-off. Slot must be free.",
  postpone: "Postpone",
  postponing: "Saving…",
  confirmPostpone: "Confirm postpone",
  cancelPostpone: "Cancel",
  postponeDate: "New date (optional)",
  postponeTime: "Kick-off (if dating now)",
  postponeDateHint:
    "Leave blank to park with no date. With a date and kick-off, the match moves there — only if that slot is free.",
  setDate: "Set date",
  setDateLabel: "New date",
  setTimeLabel: "Kick-off",
  settingDate: "Saving…",
  confirmSetDate: "Schedule",
  scheduleTitle: "Schedule",
  statuses: {
    draft: "Draft",
    published: "Scheduled",
    completed: "Played",
    postponed: "Postponed",
    void: "Void",
    walkover: "Walkover",
  } satisfies Record<FixtureStatus, string>,
  vs: "vs",
  remove: "Remove fixture",
  actionErrors: {
    invalid_input: "Check the teams, time and game day.",
    unauthenticated: "Your session has ended. Sign in again.",
    forbidden: "Only admins can do that.",
    not_found: "That fixture no longer exists.",
    conflict: "That date and kick-off already has a fixture, or the schedule is already full.",
    save_failed: "Couldn't save. Try again.",
  } satisfies Partial<Record<ActionErrorCode, string>>,
  fallbackError: "Something went wrong. Try again.",
} as const;

export function describeFixturesError(code: ActionErrorCode): string {
  const messages: Partial<Record<ActionErrorCode, string>> = fixturesCopy.actionErrors;
  return messages[code] ?? fixturesCopy.fallbackError;
}
