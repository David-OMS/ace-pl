"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FAN_HOME_PATH } from "@/features/fan";
import { Button } from "@/ui/button";
import { ButtonLink } from "@/ui/button-link";
import { PlayerAvatar } from "@/ui/player-avatar";

import { removeMyPlayerPhoto } from "../actions/remove-my-player-photo";
import { uploadMyPlayerPhoto } from "../actions/upload-my-player-photo";
import { playersCopy } from "../copy";
import { PhotoFeedback } from "./photo-feedback";
import { PhotoPickButtons } from "./photo-pick-buttons";
import { PlayerPhotoCropper } from "./player-photo-cropper";

type PlayerPhotoFormProps = {
  name: string;
  photoUrl: string | null;
  offerSkip: boolean;
};

export function PlayerPhotoForm(props: PlayerPhotoFormProps): React.JSX.Element {
  const [draft, setDraft] = useState<Blob | null>(null);
  const [cropped, setCropped] = useState<File | null>(null);

  if (draft) {
    return (
      <PlayerPhotoCropper
        source={draft}
        onCancel={() => setDraft(null)}
        onCropped={(file) => {
          setCropped(file);
          setDraft(null);
        }}
      />
    );
  }

  return (
    <PlayerPhotoControls {...props} cropped={cropped} setCropped={setCropped} onEdit={setDraft} />
  );
}

type ControlsProps = PlayerPhotoFormProps & {
  cropped: File | null;
  setCropped: (file: File | null) => void;
  onEdit: (draft: Blob) => void;
};

function PlayerPhotoControls(props: ControlsProps): React.JSX.Element {
  const { name, photoUrl, offerSkip, cropped, setCropped, onEdit } = props;
  const router = useRouter();
  const [uploadState, uploadAction, uploading] = useActionState(uploadMyPlayerPhoto, null);
  const [removeState, removeAction, removing] = useActionState(removeMyPlayerPhoto, null);
  const copy = playersCopy.photo;

  useEffect(() => {
    if (uploadState?.ok || removeState?.ok) {
      setCropped(null);
      router.refresh();
    }
  }, [uploadState, removeState, router, setCropped]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <PlayerAvatar name={name} photoUrl={photoUrl} size="lg" />
        <div>
          <p className="font-bold">{photoUrl ? copy.change : copy.add}</p>
          <p className="text-sm">{copy.face}</p>
          {offerSkip ? <p className="text-sm text-muted">{copy.gag}</p> : null}
        </div>
      </div>
      <PhotoPickButtons disabled={uploading || removing} onPicked={onEdit} />
      {cropped ? (
        <CroppedSaveForm
          uploading={uploading}
          onCancel={() => setCropped(null)}
          onSave={(formData) => {
            formData.set("photo", cropped);
            return uploadAction(formData);
          }}
        />
      ) : null}
      <PhotoFeedback uploadState={uploadState} removeState={removeState} />
      {photoUrl ? (
        <form action={removeAction}>
          <Button type="submit" variant="danger" fullWidth disabled={removing}>
            {removing ? copy.removing : copy.remove}
          </Button>
        </form>
      ) : null}
      {offerSkip ? (
        <ButtonLink href={FAN_HOME_PATH} variant="secondary" fullWidth>
          {copy.skip}
        </ButtonLink>
      ) : null}
    </div>
  );
}

function CroppedSaveForm({
  uploading,
  onCancel,
  onSave,
}: {
  uploading: boolean;
  onCancel: () => void;
  onSave: (formData: FormData) => void | Promise<void>;
}): React.JSX.Element {
  const copy = playersCopy.photo;
  return (
    <form className="flex flex-col gap-2" action={onSave}>
      <Button type="submit" fullWidth disabled={uploading}>
        {uploading ? copy.saving : copy.save}
      </Button>
      <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
        {copy.cancelCrop}
      </Button>
    </form>
  );
}
