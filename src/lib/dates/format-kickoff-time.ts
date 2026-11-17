import { SITE } from "@/config/site";

const TIME_FORMAT = new Intl.DateTimeFormat(SITE.locale, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

/**
 * Formats a Postgres `time` (league wall-clock, Africa/Lagos) such as "18:30:00".
 * No timezone conversion — the digits are already local kick-off.
 */
export function formatKickoffTime(time: string): string {
  const [hours = "0", minutes = "0"] = time.split(":");
  return TIME_FORMAT.format(new Date(Date.UTC(1970, 0, 1, Number(hours), Number(minutes))));
}
