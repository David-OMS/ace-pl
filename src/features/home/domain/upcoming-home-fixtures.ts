const OPEN = new Set(["draft", "published"]);

type GameDay = { id: string; played_on: string };
type Fixture = {
  id: string;
  game_day_id: string;
  kickoff_time: string;
  status: string;
};

/** Next open fixtures in real order: game day, then kick-off. Fills across weeks. */
export function upcomingHomeFixtures<T extends Fixture>(
  days: readonly GameDay[],
  fixtures: readonly T[],
  limit: number,
): T[] {
  const dayOrder = new Map(days.map((day, index) => [day.id, index]));
  return fixtures
    .filter((row) => OPEN.has(row.status) && dayOrder.has(row.game_day_id))
    .sort((a, b) => {
      const byDay = (dayOrder.get(a.game_day_id) ?? 0) - (dayOrder.get(b.game_day_id) ?? 0);
      return byDay !== 0 ? byDay : a.kickoff_time.localeCompare(b.kickoff_time);
    })
    .slice(0, limit);
}
