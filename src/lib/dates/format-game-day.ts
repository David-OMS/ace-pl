import { SITE } from "@/config/site";

const GAME_DAY_FORMAT = new Intl.DateTimeFormat(SITE.locale, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Formats a calendar `date` such as "2026-11-20" as "Fri, 20 Nov 2026".
 * Anchored at UTC midnight so the weekday never slips when the server isn't in Lagos.
 * (Date columns have no timezone; timestamptz columns are UTC in the DB.)
 */
export function formatGameDay(isoDate: string): string {
  return GAME_DAY_FORMAT.format(new Date(`${isoDate}T00:00:00Z`));
}
