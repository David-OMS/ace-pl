import type { FixtureStatus } from "@/config/fixture-status";

export function isFixtureFinished(status: FixtureStatus): boolean {
  return status === "completed" || status === "walkover";
}
