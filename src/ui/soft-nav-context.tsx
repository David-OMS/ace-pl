"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition } from "react";

type SoftNavContextValue = {
  isPending: boolean;
  pendingHref: string | null;
  navigate: (href: Route) => void;
};

const SoftNavContext = createContext<SoftNavContextValue | null>(null);

type SoftNavProviderProps = {
  children: React.ReactNode;
};

/** Tracks in-app navigations so the shell can show a loader without hiding same-page chips. */
export function SoftNavProvider({ children }: SoftNavProviderProps): React.JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [requestedHref, setRequestedHref] = useState<string | null>(null);
  const pendingHref = isPending ? requestedHref : null;

  function navigate(href: Route): void {
    setRequestedHref(href);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <SoftNavContext.Provider value={{ isPending, pendingHref, navigate }}>
      {children}
    </SoftNavContext.Provider>
  );
}

export function useSoftNav(): SoftNavContextValue {
  const value = useContext(SoftNavContext);
  if (!value) {
    throw new Error("useSoftNav must be used inside SoftNavProvider");
  }
  return value;
}

export function useSoftNavOptional(): SoftNavContextValue | null {
  return useContext(SoftNavContext);
}

export function hrefPath(href: string): string {
  const query = href.indexOf("?");
  return query === -1 ? href : href.slice(0, query);
}
