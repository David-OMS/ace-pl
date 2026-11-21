import { gameweekDeadlineMs } from "./gameweek-deadline-ms";

const DEADLINE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** e.g. "Deadline · Thu 27 Nov, 23:59" (Lagos). */
export function formatFantasyDeadline(playedOnIso: string): string {
  const stamp = DEADLINE_FORMAT.format(new Date(gameweekDeadlineMs(playedOnIso)));
  return `Deadline · ${stamp}`;
}
