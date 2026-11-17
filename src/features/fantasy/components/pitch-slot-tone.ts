import type { PitchSlot } from "../domain/build-pitch-slots";

export type PitchSlotTone = "pitch" | "surface";

/** Bench lives on the surface card; starters on the grass. */
export function toneForSlot(slot: Pick<PitchSlot, "isBench">): PitchSlotTone {
  return slot.isBench ? "surface" : "pitch";
}

export type PitchSlotToneClasses = {
  nameClass: string;
  metaClass: string;
  emptyClass: string;
  plusBorder: string;
  plusBg: string;
};

export function pitchSlotToneClasses(tone: PitchSlotTone): PitchSlotToneClasses {
  if (tone === "pitch") {
    return {
      nameClass: "text-on-hero",
      metaClass: "text-on-hero/80",
      emptyClass: "text-on-hero/80",
      plusBorder: "border-on-hero/50",
      plusBg: "bg-pitch-alt text-on-hero",
    };
  }
  return {
    nameClass: "text-ink",
    metaClass: "text-muted",
    emptyClass: "text-muted",
    plusBorder: "border-line",
    plusBg: "bg-surface-alt text-ink",
  };
}
