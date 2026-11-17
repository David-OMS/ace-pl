"use client";

import { useRef, useState } from "react";

import { Button } from "@/ui/button";

import { playersCopy } from "../copy";
import { mirrorImageFile } from "../domain/export-player-photo";

type PhotoPickButtonsProps = {
  disabled: boolean;
  onPicked: (draft: Blob) => void;
};

export function PhotoPickButtons({ disabled, onPicked }: PhotoPickButtonsProps): React.JSX.Element {
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [picking, setPicking] = useState(false);
  const copy = playersCopy.photo;
  const busy = disabled || picking;

  return (
    <>
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setPicking(true);
          // Front camera preview is mirrored; the file is not. Match what they saw.
          void mirrorImageFile(file)
            .then(onPicked)
            .finally(() => setPicking(false));
        }}
      />
      <input
        ref={galleryInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onPicked(file);
        }}
      />
      <Button type="button" fullWidth disabled={busy} onClick={() => cameraInput.current?.click()}>
        {picking ? copy.openingCamera : copy.takePhoto}
      </Button>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={busy}
        onClick={() => galleryInput.current?.click()}
      >
        {copy.choosePhoto}
      </Button>
    </>
  );
}
