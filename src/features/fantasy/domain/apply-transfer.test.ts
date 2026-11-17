import { applyTransfer, applyTransferBatch } from "./apply-transfer";

describe("applyTransfer", () => {
  it("updates bank when the swap is affordable", () => {
    const result = applyTransfer({
      bank: 2,
      freeTransfers: 2,
      outPrice: 5,
      inPrice: 7,
      isUnlimited: false,
    });
    expect(result).toEqual({
      ok: true,
      value: { bank: 0, freeTransfers: 1, pointCost: 0 },
    });
  });

  it("rejects when bank plus out price cannot cover the in player", () => {
    const result = applyTransfer({
      bank: 1,
      freeTransfers: 2,
      outPrice: 5,
      inPrice: 9,
      isUnlimited: false,
    });
    expect(result).toEqual({ ok: false, error: "insufficient_funds" });
  });

  it("charges a −5 hit after free transfers are used", () => {
    const result = applyTransfer({
      bank: 4,
      freeTransfers: 0,
      outPrice: 5,
      inPrice: 5,
      isUnlimited: false,
    });
    expect(result).toEqual({
      ok: true,
      value: { bank: 4, freeTransfers: 0, pointCost: 5 },
    });
  });

  it("does not spend free transfers before gameweek 1", () => {
    const result = applyTransfer({
      bank: 3,
      freeTransfers: 2,
      outPrice: 5,
      inPrice: 7,
      isUnlimited: true,
    });
    expect(result).toEqual({
      ok: true,
      value: { bank: 1, freeTransfers: 2, pointCost: 0 },
    });
  });

  it("applies a batch and sums hit points", () => {
    const result = applyTransferBatch({ bank: 10, freeTransfers: 1, isUnlimited: false }, [
      { outPrice: 5, inPrice: 5 },
      { outPrice: 7, inPrice: 7 },
      { outPrice: 5, inPrice: 5 },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ bank: 10, freeTransfers: 0, pointCost: 10 });
  });
});
