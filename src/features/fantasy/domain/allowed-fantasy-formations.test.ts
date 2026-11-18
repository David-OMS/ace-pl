import { allowedFantasyFormations } from "./allowed-fantasy-formations";

describe("allowedFantasyFormations", () => {
  it("allows every shape while the squad still has empty slots", () => {
    const allowed = allowedFantasyFormations(["GK", "DEF", "MID"], 9);
    expect(allowed.size).toBe(4);
    expect(allowed.has("3-2-1")).toBe(true);
  });

  it("locks shapes the full squad cannot fill", () => {
    const full = ["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "MID"] as const;
    const allowed = allowedFantasyFormations(full, 9);
    expect(allowed.has("2-2-2")).toBe(true);
    expect(allowed.has("3-2-1")).toBe(false);
  });
});
