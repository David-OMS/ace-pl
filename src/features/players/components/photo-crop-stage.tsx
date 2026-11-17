import type { PointerEventHandler } from "react";

type PhotoCropStageProps = {
  previewUrl: string;
  width: number;
  height: number;
  left: number;
  top: number;
  viewport: number;
  onImageLoad: (width: number, height: number) => void;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
};

export function PhotoCropStage({
  previewUrl,
  width,
  height,
  left,
  top,
  viewport,
  onImageLoad,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: PhotoCropStageProps): React.JSX.Element {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-card border-2 border-line bg-surface-alt"
      style={{ width: viewport, height: viewport, touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Crop preview only; export draws the same frame on a canvas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt=""
        draggable={false}
        className="absolute max-w-none select-none"
        style={{ width, height, left, top }}
        onLoad={(event) =>
          onImageLoad(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)
        }
      />
    </div>
  );
}
