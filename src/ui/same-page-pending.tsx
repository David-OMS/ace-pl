"use client";

import { usePathname } from "next/navigation";

import { PageLoading } from "./page-loading";
import { hrefPath, useSoftNavOptional } from "./soft-nav-context";

type SamePagePendingProps = {
  children: React.ReactNode;
  blocks?: 2 | 3 | 4;
};

/** Skeleton for a block while a same-page link (filters, tournament chips) is loading. */
export function SamePagePending({ children, blocks = 3 }: SamePagePendingProps): React.JSX.Element {
  const pathname = usePathname();
  const softNav = useSoftNavOptional();
  const pendingHere =
    softNav?.isPending === true &&
    softNav.pendingHref !== null &&
    hrefPath(softNav.pendingHref) === pathname;
  if (pendingHere) return <PageLoading blocks={blocks} />;
  return <>{children}</>;
}
