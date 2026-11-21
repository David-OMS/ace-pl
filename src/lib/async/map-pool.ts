/** Run async work over items with a fixed concurrency cap. */
export async function mapPool<T>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  const limit = Math.max(1, concurrency);
  let index = 0;

  async function runNext(): Promise<void> {
    while (index < items.length) {
      const current = index;
      index += 1;
      const item = items[current];
      if (item === undefined) return;
      await worker(item);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));
}
