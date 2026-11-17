"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** After a successful server action, reload the current RSC page props. */
export function useRefreshOnOk(ok: boolean | undefined): void {
  const router = useRouter();
  useEffect(() => {
    if (!ok) return;
    router.refresh();
  }, [ok, router]);
}
