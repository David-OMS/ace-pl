"use client";

import { useEffect, type ReactNode } from "react";

type FantasyBottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
  /** Max height of the sheet panel (Tailwind class). */
  maxHeightClass?: string;
  /**
   * modal: dims the page and blocks pitch taps (player list).
   * dock: sheet only — page stays scrollable so bench stays reachable.
   */
  mode?: "modal" | "dock";
};

/** Bottom panel for transfer actions so controls stay on screen. */
export function FantasyBottomSheet({
  onClose,
  children,
  maxHeightClass = "max-h-[75vh]",
  mode = "modal",
}: FantasyBottomSheetProps): React.JSX.Element {
  useEscapeToClose(onClose);
  useBodyScrollLock(mode === "modal");

  if (mode === "dock") {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <SheetPanel maxHeightClass={maxHeightClass} compact>
          {children}
        </SheetPanel>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/50">
      <button
        type="button"
        className="min-h-0 flex-1 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <SheetPanel maxHeightClass={maxHeightClass}>{children}</SheetPanel>
    </div>
  );
}

function SheetPanel(args: {
  maxHeightClass: string;
  children: ReactNode;
  compact?: boolean;
}): React.JSX.Element {
  const frame = args.compact
    ? "border border-line shadow-offset-sm"
    : "border-2 border-line shadow-offset";
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`pointer-events-auto ${args.maxHeightClass} overflow-hidden rounded-t-card bg-surface ${frame}`}
    >
      {args.children}
    </div>
  );
}

function useEscapeToClose(onClose: () => void): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
}

function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
