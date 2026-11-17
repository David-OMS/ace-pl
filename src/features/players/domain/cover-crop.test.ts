import { clampCoverOffset, coverScale, sourceRectForCoverCrop } from "./cover-crop";

describe("cover crop", () => {
  const base = {
    imageWidth: 1000,
    imageHeight: 800,
    viewport: 280,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  };

  it("scales so the shorter side fills the square", () => {
    expect(coverScale(base)).toBeCloseTo(280 / 800);
  });

  it("returns a square source that fits inside the image", () => {
    const rect = sourceRectForCoverCrop(base);
    expect(rect.sw).toBeCloseTo(rect.sh);
    expect(rect.sx).toBeGreaterThanOrEqual(0);
    expect(rect.sy).toBeGreaterThanOrEqual(0);
    expect(rect.sx + rect.sw).toBeLessThanOrEqual(1000 + 0.01);
    expect(rect.sy + rect.sh).toBeLessThanOrEqual(800 + 0.01);
  });

  it("stops a drag from leaving empty space in the square", () => {
    const clamped = clampCoverOffset({ ...base, offsetX: 9999, offsetY: -9999 });
    expect(Math.abs(clamped.offsetX)).toBeLessThan(9999);
    const rect = sourceRectForCoverCrop({ ...base, ...clamped });
    expect(rect.sx).toBeGreaterThanOrEqual(-0.01);
    expect(rect.sy + rect.sh).toBeLessThanOrEqual(800 + 0.01);
  });
});
