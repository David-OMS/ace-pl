import { fail, ok } from "./action-result";

describe("action results", () => {
  it("wraps successful data", () => {
    expect(ok({ fixtureId: "f1" })).toEqual({ ok: true, data: { fixtureId: "f1" } });
  });

  it("carries the error code on failure", () => {
    expect(fail("forbidden")).toEqual({ ok: false, error: "forbidden" });
  });
});
