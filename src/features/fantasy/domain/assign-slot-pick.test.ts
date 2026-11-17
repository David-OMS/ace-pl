import { assignSlotPick } from "./assign-slot-pick";
import { buildPitchSlots } from "./build-pitch-slots";

describe("assignSlotPick", () => {
  it("fills a matching starter slot", () => {
    const fwd = buildPitchSlots("2-2-2", 9).find((s) => s.line === "FWD");
    expect(fwd).toBeDefined();
    const picks = assignSlotPick({
      formation: "2-2-2",
      squadSize: 9,
      budget: 72,
      picks: [],
      slot: fwd!,
      player: { id: "p1", position: "FWD", price: 10 },
    });
    expect(picks).toHaveLength(1);
    expect(picks[0]?.slotKey).toBe(fwd!.key);
  });

  it("rejects wrong position on a starter slot", () => {
    const fwd = buildPitchSlots("2-2-2", 9).find((s) => s.line === "FWD")!;
    const picks = assignSlotPick({
      formation: "2-2-2",
      squadSize: 9,
      budget: 72,
      picks: [],
      slot: fwd,
      player: { id: "p1", position: "MID", price: 6 },
    });
    expect(picks).toHaveLength(0);
  });

  it("rejects picks that would exceed budget", () => {
    const fwd = buildPitchSlots("2-2-2", 9).find((s) => s.line === "FWD")!;
    const picks = assignSlotPick({
      formation: "2-2-2",
      squadSize: 9,
      budget: 10,
      picks: [],
      slot: fwd,
      player: { id: "p1", position: "FWD", price: 12 },
    });
    expect(picks).toHaveLength(0);
  });
});
