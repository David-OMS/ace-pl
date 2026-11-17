/** Compact table / mockup: +8, 0, −3. */
export function formatGoalDifference(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}
