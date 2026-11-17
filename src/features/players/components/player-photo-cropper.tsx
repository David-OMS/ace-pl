"use client";

import { useState } from "react";

import { Button } from "@/ui/button";

import { playersCopy } from "../copy";
import { cropImageFile } from "../domain/export-player-photo";
import { PhotoCropStage } from "./photo-crop-stage";
import { PhotoZoomSlider } from "./photo-zoom-slider";
import { usePhotoCropSession } from "./use-photo-crop-session";

type PlayerPhotoCropperProps = {
  source: Blob;
  onCancel: () => void;
  onCropped: (file: File) => void;
};

export function PlayerPhotoCropper({
  source,
  onCancel,
  onCropped,
}: PlayerPhotoCropperProps): React.JSX.Element {
  const copy = playersCopy.photo;
  const crop = usePhotoCropSession(source);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">{copy.cropHint}</p>
      <PhotoCropStage
        previewUrl={crop.previewUrl}
        width={crop.width}
        height={crop.height}
        left={crop.left}
        top={crop.top}
        viewport={crop.viewport}
        onImageLoad={crop.onImageLoad}
        onPointerDown={crop.onPointerDown}
        onPointerMove={crop.onPointerMove}
        onPointerUp={crop.onPointerUp}
      />
      <PhotoZoomSlider zoom={crop.zoom} onZoom={crop.onZoom} />
      <Button
        type="button"
        fullWidth
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void cropImageFile(source, crop.cropView)
            .then((blob) => onCropped(new File([blob], "photo.jpg", { type: "image/jpeg" })))
            .finally(() => setBusy(false));
        }}
      >
        {busy ? copy.cropping : copy.useCrop}
      </Button>
      <Button type="button" variant="secondary" fullWidth disabled={busy} onClick={onCancel}>
        {copy.cancelCrop}
      </Button>
    </div>
  );
}
