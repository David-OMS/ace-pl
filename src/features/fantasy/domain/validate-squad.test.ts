import type { SquadPickInput } from "./validate-squad";
import { validateSquad } from "./validate-squad";

function pick(
  partial: Partial<SquadPickInput> & Pick<SquadPickInput, "playerId" | "position">,
): SquadPickInput {
  return {
    price: 5,
    isBench: false,
    isCaptain: false,
    isVice: false,
    ...partial,
  };
}

/** 2-2-2 starters + 1 bench for squad size 8. */
function validPicks(): SquadPickInput[] {
  return [
    pick({ playerId: "gk", position: "GK", isCaptain: true }),
    pick({ playerId: "d1", position: "DEF" }),
    pick({ playerId: "d2", position: "DEF", isVice: true }),
    pick({ playerId: "m1", position: "MID" }),
    pick({ playerId: "m2", position: "MID" }),
    pick({ playerId: "f1", position: "FWD" }),
    pick({ playerId: "f2", position: "FWD" }),
    pick({ playerId: "b1", position: "MID", isBench: true }),
  ];
}

describe("validateSquad", () => {
  it("accepts a legal 2-2-2 squad and returns remaining bank", () => {
    const result = validateSquad({
      formation: "2-2-2",
      squadSize: 8,
      budget: 64,
      picks: validPicks(),
    });
    expect(result).toEqual({
      ok: true,
      value: { bank: 24, budget: 64, spent: 40 },
    });
  });

  it("rejects the wrong formation shape", () => {
    const picks = validPicks();
    const mid = picks.find((p) => p.playerId === "m2");
    if (mid) mid.position = "FWD";
    const result = validateSquad({
      formation: "2-2-2",
      squadSize: 8,
      budget: 64,
      picks,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("wrong_outfield");
  });

  it("rejects over budget", () => {
    const picks = validPicks().map((p) => ({ ...p, price: 12 }));
    const result = validateSquad({
      formation: "2-2-2",
      squadSize: 8,
      budget: 64,
      picks,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("over_budget");
  });

  it("rejects duplicate players and missing captain", () => {
    const dup = validPicks();
    dup[7] = { ...dup[7]!, playerId: "m1" };
    const dupResult = validateSquad({
      formation: "2-2-2",
      squadSize: 8,
      budget: 64,
      picks: dup,
    });
    expect(dupResult.ok).toBe(false);
    if (dupResult.ok) return;
    expect(dupResult.error).toBe("duplicate_player");

    const noCap = validPicks().map((p) => ({ ...p, isCaptain: false }));
    const capResult = validateSquad({
      formation: "2-2-2",
      squadSize: 8,
      budget: 64,
      picks: noCap,
    });
    expect(capResult.ok).toBe(false);
    if (capResult.ok) return;
    expect(capResult.error).toBe("need_one_captain");
  });
});
