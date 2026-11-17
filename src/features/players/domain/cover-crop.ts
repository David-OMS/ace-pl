/** Square crop from a zoomed, panned cover view. Offsets are in viewport pixels. */
export type CoverCropView = {
  imageWidth: number;
  imageHeight: number;
  viewport: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export type SourceRect = { sx: number; sy: number; sw: number; sh: number };

export function coverScale(view: CoverCropView): number {
  const { imageWidth, imageHeight, viewport, zoom } = view;
  return Math.max(viewport / imageWidth, viewport / imageHeight) * Math.max(zoom, 1);
}

/** Keeps the square inside the image while zooming and dragging. */
export function clampCoverOffset(view: CoverCropView): { offsetX: number; offsetY: number } {
  const scale = coverScale(view);
  const maxX = Math.max(0, (view.imageWidth * scale - view.viewport) / 2);
  const maxY = Math.max(0, (view.imageHeight * scale - view.viewport) / 2);
  return {
    offsetX: Math.min(maxX, Math.max(-maxX, view.offsetX)),
    offsetY: Math.min(maxY, Math.max(-maxY, view.offsetY)),
  };
}

export function sourceRectForCoverCrop(view: CoverCropView): SourceRect {
  const clamped = clampCoverOffset(view);
  const scale = coverScale({ ...view, ...clamped });
  const left = (view.viewport - view.imageWidth * scale) / 2 + clamped.offsetX;
  const top = (view.viewport - view.imageHeight * scale) / 2 + clamped.offsetY;
  return {
    sx: -left / scale,
    sy: -top / scale,
    sw: view.viewport / scale,
    sh: view.viewport / scale,
  };
}
