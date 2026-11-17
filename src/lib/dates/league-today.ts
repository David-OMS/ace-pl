import { SITE } from "@/config/site";

/** Today's calendar date in the league timezone as `YYYY-MM-DD`. */
export function leagueToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
