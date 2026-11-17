import { sourceRectForCoverCrop, type CoverCropView } from "./cover-crop";

const OUTPUT_SIZE = 512;
const JPEG_QUALITY = 0.9;

/** Front-camera snaps come out flipped vs the live preview. Flip them back. */
export async function mirrorImageFile(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvasBlob(canvas, "image/jpeg", JPEG_QUALITY);
}

export async function cropImageFile(
  source: Blob,
  view: Omit<CoverCropView, "imageWidth" | "imageHeight">,
): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  const rect = sourceRectForCoverCrop({
    ...view,
    imageWidth: bitmap.width,
    imageHeight: bitmap.height,
  });
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  bitmap.close();
  return canvasBlob(canvas, "image/jpeg", JPEG_QUALITY);
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("blob"))), type, quality);
  });
}
