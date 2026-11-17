import "server-only";

import { unstable_cache, updateTag } from "next/cache";

import { FAN_PUBLIC_CACHE_SECONDS, FAN_PUBLIC_CACHE_TAG } from "@/config/public-cache";

/** Share one public read across visitors until the TTL, or until a publish clears the tag. */
export function fanPublicCache<T>(key: string, load: () => Promise<T>): Promise<T> {
  return unstable_cache(load, [key], {
    revalidate: FAN_PUBLIC_CACHE_SECONDS,
    tags: [FAN_PUBLIC_CACHE_TAG],
  })();
}

/** Call from a server action after a write fans can see. */
export function revalidateFanPublic(): void {
  updateTag(FAN_PUBLIC_CACHE_TAG);
}
