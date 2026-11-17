"use client";

import { usePathname } from "next/navigation";

import { PageLoading } from "./page-loading";
import { hrefPath, useSoftNav } from "./soft-nav-context";

type SoftNavBusyProps = {
  children: React.ReactNode;
  blocks?: 2 | 3 | 4;
};

/** Full-page skeleton only when leaving the current path. Query switches keep the page. */
export function SoftNavBusy({ children, blocks = 4 }: SoftNavBusyProps): React.JSX.Element {
  const pathname = usePathname();
  const { isPending, pendingHref } = useSoftNav();
  const leavingPage = isPending && pendingHref !== null && hrefPath(pendingHref) !== pathname;
  if (leavingPage) return <PageLoading blocks={blocks} />;
  return <>{children}</>;
}
