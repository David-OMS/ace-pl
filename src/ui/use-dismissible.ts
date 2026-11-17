"use client";

import { useEffect, type RefObject } from "react";

/** Closes on outside click or Escape while `isOpen` is true. */
export function useDismissible(
  isOpen: boolean,
  rootRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) onDismiss();
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onDismiss, rootRef]);
}
