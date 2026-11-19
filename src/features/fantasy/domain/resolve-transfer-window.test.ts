import { resolveTransferWindow } from "./resolve-transfer-window";

describe("resolveTransferWindow", () => {
  const gw1 = "2026-11-20"; // Fri; deadline Thu 19 Nov 22:59:59 UTC
  const gw2 = "2026-11-27";
  const beforeFirst = Date.UTC(2026, 10, 19, 12, 0, 0); // Thu before deadline
  const afterFirst = Date.UTC(2026, 10, 20, 12, 0, 0); // Fri match day
  const between = Date.UTC(2026, 10, 24, 12, 0, 0); // Mon after GW1
  const afterSecond = Date.UTC(2026, 10, 27, 12, 0, 0);

  it("is unlimited with no game days", () => {
    expect(resolveTransferWindow({ nowMs: afterFirst, gameDays: [] })).toBe("unlimited");
  });

  it("is unlimited before the first deadline", () => {
    expect(
      resolveTransferWindow({
        nowMs: beforeFirst,
        gameDays: [{ playedOn: gw1, fixtures: [{ status: "published" }] }],
      }),
    ).toBe("unlimited");
  });

  it("locks after deadline while fixtures are still open", () => {
    expect(
      resolveTransferWindow({
        nowMs: afterFirst,
        gameDays: [{ playedOn: gw1, fixtures: [{ status: "published" }] }],
      }),
    ).toBe("locked");
  });

  it("opens after every fixture that week is finished", () => {
    expect(
      resolveTransferWindow({
        nowMs: between,
        gameDays: [
          {
            playedOn: gw1,
            fixtures: [{ status: "completed" }, { status: "walkover" }],
          },
        ],
      }),
    ).toBe("open");
  });

  it("locks again after the next GW deadline until that week finishes", () => {
    expect(
      resolveTransferWindow({
        nowMs: afterSecond,
        gameDays: [
          { playedOn: gw1, fixtures: [{ status: "completed" }] },
          { playedOn: gw2, fixtures: [{ status: "published" }] },
        ],
      }),
    ).toBe("locked");
  });

  it("treats postponed fixtures as unfinished", () => {
    expect(
      resolveTransferWindow({
        nowMs: afterFirst,
        gameDays: [
          {
            playedOn: gw1,
            fixtures: [{ status: "completed" }, { status: "postponed" }],
          },
        ],
      }),
    ).toBe("locked");
  });
});
