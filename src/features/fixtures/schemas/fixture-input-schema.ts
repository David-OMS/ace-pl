import { z } from "zod";

const timeSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, "invalid_time");

export const fixtureInputSchema = z
  .object({
    tournamentId: z.uuid(),
    gameDayId: z.uuid(),
    homeTeamId: z.uuid(),
    awayTeamId: z.uuid(),
    kickoffTime: timeSchema,
  })
  .refine((value) => value.homeTeamId !== value.awayTeamId, {
    message: "same_team",
    path: ["awayTeamId"],
  });

export type FixtureInput = z.infer<typeof fixtureInputSchema>;

export function readFixtureForm(formData: FormData): unknown {
  return {
    tournamentId: formData.get("tournamentId"),
    gameDayId: formData.get("gameDayId"),
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId"),
    kickoffTime: formData.get("kickoffTime"),
  };
}

export function toKickoffTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}
