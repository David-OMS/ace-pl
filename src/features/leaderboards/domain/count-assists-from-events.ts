/** Assists are stored on goal rows as assist_player_id, not a separate event type. */
export function countAssistsFromEvents(
  events: readonly { assistPlayerId: string | null }[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (!event.assistPlayerId) continue;
    counts.set(event.assistPlayerId, (counts.get(event.assistPlayerId) ?? 0) + 1);
  }
  return counts;
}
