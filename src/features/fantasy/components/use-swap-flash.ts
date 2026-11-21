"use client";

import { useEffect, useMemo, useRef } from "react";

import { fantasyCopy } from "../copy";

/** Turns `name|name` flash keys into copy and auto-clears after a beat. */
export function useSwapFlash(flashKey: string | null, clear: () => void): string | null {
  const clearRef = useRef(clear);
  useEffect(() => {
    clearRef.current = clear;
  });

  const message = useMemo(() => {
    if (!flashKey) return null;
    const [a, b] = flashKey.split("|");
    if (!a || !b) return null;
    return fantasyCopy.swappedFlash(a, b);
  }, [flashKey]);

  useEffect(() => {
    if (!flashKey) return;
    const timer = window.setTimeout(() => clearRef.current(), 2500);
    return () => window.clearTimeout(timer);
  }, [flashKey]);

  return message;
}
